import { chromium } from 'playwright';
import { isRelevantJob } from './matcher';
import type { JobFetcher, JobPost } from './types';

export class BiotronikFetcher implements JobFetcher {
  private url = 'https://career5.successfactors.eu/career?company=C0001096615P';

  async fetch(query: string, options?: { unfiltered?: boolean }): Promise<JobPost[]> {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    });
    const page = await context.newPage();

    try {
      await page.goto(this.url);

      // Handle cookies - Biotronik uses Usercentrics
      try {
        const acceptButton = page.locator('button:has-text("Accept All"), #uc-center-accept-all-button');
        if (await acceptButton.isVisible({ timeout: 5000 })) {
          await acceptButton.click();
        }
      } catch (e) {
        // Ignore if cookie banner doesn't appear
      }

      // SuccessFactors search input often has name="keyword"
      const keywordInput = page.locator('input[name="keyword"]');
      await keywordInput.waitFor({ state: 'visible', timeout: 20000 });
      await keywordInput.fill(query);

      // Search button
      const searchButton = page.getByRole('button', { name: 'Search Jobs' });
      await searchButton.click();

      // Wait for results to populate
      await page.waitForLoadState('networkidle');
      // SuccessFactors can be slow to render results after network is idle
      await page.waitForTimeout(5000);
      
      const jobRowSelector = 'tr:has(a.jobTitle)';
      await page.waitForSelector(jobRowSelector, { timeout: 20000 }).catch(() => {
        console.warn('No job rows found within timeout');
      });

      // Note: We can't easily pass the matcher function into page.evaluate
      // so we'll filter AFTER getting the raw data
      const rawJobs = await page.evaluate(({ selector }) => {
        const rows = Array.from(document.querySelectorAll(selector));
        console.log(`Found ${rows.length} rows with selector ${selector}`);
        return rows.map((row) => {
          const titleLink = row.querySelector('a.jobTitle') as HTMLAnchorElement;
          if (!titleLink) return null;

          const titleText = titleLink.innerText.trim();
          const emSpans = Array.from(row.querySelectorAll('.jobContentEM')) as HTMLElement[];
          const id = emSpans[0]?.textContent?.trim() || '';
          const datePosted = emSpans[1]?.textContent?.replace('Posted on', '')?.trim() || '';
          
          let location = '';
          if (titleText.includes(':')) {
            location = titleText.split(':').pop()?.trim() || '';
          }

          return {
            id,
            title: titleText,
            location: location,
            url: titleLink.href,
            datePosted,
          };
        }).filter((j) => j !== null);
      }, { selector: jobRowSelector });

      console.log(`Biotronik found ${rawJobs.length} raw jobs`);

      const filtered = (rawJobs as any[])
        .filter((job) => {
          const relevant = options?.unfiltered || isRelevantJob(job.title);
          if (!relevant) console.log(`Biotronik filtering out: ${job.title}`);
          return relevant;
        });

      console.log(`Biotronik found ${filtered.length} filtered jobs`);

      return filtered
        .map((job) => ({
          ...job,
          id: `biotronik:${job.id}`,
          company: 'Biotronik'
        }));
    } catch (error) {
      console.error('Biotronik fetch failed:', error);
      return [];
    } finally {
      await browser.close();
    }
  }
}
