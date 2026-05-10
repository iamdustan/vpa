import { isRelevantJob } from './matcher';
import { MedtronicResponseSchema } from './schemas';
import type { JobFetcher, JobPost } from './types';

export class MedtronicFetcher implements JobFetcher {
  private readonly baseUrl = 'https://medtronic.wd1.myworkdayjobs.com/wday/cxs/medtronic/MedtronicCareers/jobs';

  async fetch(query: string, options?: { unfiltered?: boolean }): Promise<JobPost[]> {
    console.log(`[Medtronic] Actually fetching network data for "${query}"...`);
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        appliedFacets: {},
        limit: 20,
        offset: 0,
        searchText: query,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from Medtronic: ${response.statusText}`);
    }

    const rawData = await response.json();
    const result = MedtronicResponseSchema.safeParse(rawData);
    
    if (!result.success) {
      console.error('[Medtronic] Schema validation failed:', result.error.format());
      return [];
    }

    const rawJobs = result.data.jobPostings || [];
    
    return rawJobs
      .filter((post) => {
        const title = post.title;
        const location = post.locationsText.toLowerCase();

        // Filter for US only
        const isUS = location.includes('united states') || location.includes('usa');
        if (!isUS) return false;

        if (options?.unfiltered) return true;

        return isRelevantJob(title);
      })
      .map((post) => ({
        id: `medtronic:${post.bulletinNumber || post.externalPath}`,
        title: post.title,
        company: 'Medtronic',
        location: post.locationsText,
        url: `https://medtronic.wd1.myworkdayjobs.com/MedtronicCareers${post.externalPath}`,
        datePosted: post.postedOn,
      }));
  }
}
