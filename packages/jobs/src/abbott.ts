import { isRelevantJob } from './matcher';
import { AbbottResponseSchema } from './schemas';
import type { JobFetcher, JobPost } from './types';

export class AbbottFetcher implements JobFetcher {
  private readonly baseUrl = 'https://www.jobs.abbott/widgets';

  async fetch(query: string, options?: { unfiltered?: boolean }): Promise<JobPost[]> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lang: 'en_us',
        deviceType: 'desktop',
        country: 'us',
        pageName: 'home',
        ddoKey: 'globalSearchEventV3',
        location_size: 50,
        category_size: 50,
        job_size: 50,
        keywords: query,
        category: 'category',
        location: 'location',
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from Abbott: ${response.statusText}`);
    }

    const rawData = await response.json();
    const result = AbbottResponseSchema.safeParse(rawData);
    
    if (!result.success) {
      console.error('[Abbott] Schema validation failed:', result.error.format());
      return [];
    }
    
    // Abbott's structure is deeply nested and varies
    const rawJobs = result.data.globalSearchEventV3?.jobTitles?.data?.titles ||
                    result.data.globalSearchEventV3?.data?.jobs || 
                    [];

    return rawJobs
      .filter((post) => {
        if (options?.unfiltered) return true;
        return isRelevantJob(post.title || '');
      })
      .map((post) => ({
        id: `abbott:${post.jobId}`,
        title: post.title,
        company: 'Abbott',
        location: post.location || 'United States',
        url: `https://www.jobs.abbott/us/en/job/${post.jobId}`,
        datePosted: post.postedDate,
      }));
  }
}
