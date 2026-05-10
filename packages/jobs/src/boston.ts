import { isRelevantJob } from './matcher';
import { BostonResponseSchema } from './schemas';
import type { JobFetcher, JobPost } from './types';

export class BostonScientificFetcher implements JobFetcher {
  private readonly baseUrl = 'https://bostonscientific.eightfold.ai/api/pcsx/search';

  async fetch(query: string, options?: { unfiltered?: boolean }): Promise<JobPost[]> {
    const url = new URL(this.baseUrl);
    url.searchParams.append('domain', 'bostonscientific.com');
    url.searchParams.append('query', query);
    url.searchParams.append('location', 'United States');
    url.searchParams.append('start', '0');
    url.searchParams.append('sort_by', 'relevance');
    url.searchParams.append('filter_include_remote', '1');

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/plain, */*',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from Boston Scientific: ${response.statusText}`);
    }

    const rawData = await response.json();
    const result = BostonResponseSchema.safeParse(rawData);

    if (!result.success) {
      console.error('[Boston] Schema validation failed:', result.error.format());
      return [];
    }

    const rawJobs = result.data.data.positions || [];

    return rawJobs
      .filter((post) => {
        if (options?.unfiltered) return true;
        return isRelevantJob(post.name || '');
      })
      .map((post) => {
        let jobUrl = post.positionUrl || `https://bostonscientific.eightfold.ai/careers?job=${post.id}`;
        if (jobUrl.startsWith('/')) {
          jobUrl = `https://bostonscientific.eightfold.ai${jobUrl}`;
        }

        return {
          id: `boston:${post.id}`,
          title: post.name,
          company: 'Boston Scientific',
          location: post.locations?.[0] || 'Unknown',
          url: jobUrl,
          datePosted: post.postedTs ? new Date(post.postedTs * 1000).toISOString() : undefined,
        };
      });
  }
}
