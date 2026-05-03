import { chromium } from 'playwright';
import type { JobFetcher, JobPost } from './types';

export class BiotronikFetcher implements JobFetcher {
  private url = 'https://career5.successfactors.eu/career?company=C0001096615P';

  async fetch(query: string): Promise<JobPost[]> {
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

      const jobs = await page.evaluate((selector) => {
        const rows = Array.from(document.querySelectorAll(selector));
        return rows.map((row) => {
          const titleLink = row.querySelector('a.jobTitle') as HTMLAnchorElement;
          const noteSection = row.querySelector('.noteSection') as HTMLElement;
          
          if (!titleLink) return null;

          const titleText = titleLink.innerText.trim();
          const titleLower = titleText.toLowerCase();

          // Strict filtering: Must be Clinical Specialist, CRM, or Field related
          const isClinical = titleLower.includes('clinical specialist') || 
                            titleLower.includes('clinical support') ||
                            titleLower.includes('procedural specialist');
          const isCRM = titleLower.includes('crm') || 
                        titleLower.includes('cardiac rhythm') || 
                        titleLower.includes('pacemaker');
          const isField = titleLower.includes('field');

          // Exclusions: Accounting, Product Specialist, Research, Marketing, etc.
          const isIrrelevant = titleLower.includes('accounting') ||
                               titleLower.includes('product specialist') ||
                               titleLower.includes('treasury') ||
                               titleLower.includes('receivable') ||
                               titleLower.includes('marketing') ||
                               titleLower.includes('research') ||
                               titleLower.includes('software');

          if (!(isClinical || isCRM || isField) || isIrrelevant) return null;

          // Extract ID and Date from noteSection
          const emSpans = Array.from(row.querySelectorAll('.jobContentEM'));
          const id = emSpans[0]?.textContent?.trim() || '';
          const datePosted = emSpans[1]?.textContent?.replace('Posted on', '')?.trim() || '';
          
          let location = '';
          if (titleText.includes(':')) {
            location = titleText.split(':').pop()?.trim() || '';
          }

          return {
            id,
            title: titleText,
            company: 'Biotronik',
            location: location,
            url: titleLink.href,
            datePosted,
          };
        }).filter((j) => j !== null && j.title && j.url);
      }, jobRowSelector);

      return jobs as JobPost[];
    } catch (error) {
      console.error('Biotronik fetch failed:', error);
      return [];
    } finally {
      await browser.close();
    }
  }
}
