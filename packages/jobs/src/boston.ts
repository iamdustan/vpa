import type { JobFetcher, JobPost } from './types';

export class BostonScientificFetcher implements JobFetcher {
  private readonly baseUrl = 'https://bostonscientific.eightfold.ai/api/pcsx/search';

  async fetch(query: string): Promise<JobPost[]> {
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

    const json = await response.json();
    const rawJobs = json.data?.positions || [];

    return rawJobs
      .filter((post: any) => {
        const title = (post.name || '').toLowerCase();
        // Strict filtering: Clinical Specialist and CRM related
        // Note: Some Boston Sci roles use "Field Clinical Representative" for CRM
        const isClinicalSpecialist = title.includes('clinical specialist') || title.includes('clinical representative');
        const isCRM = title.includes('crm') || title.includes('cardiac rhythm');
        
        // Exclusions
        const isNotIrrelevant = !title.includes('research') && 
                                !title.includes('marketing') && 
                                !title.includes('software');

        return isClinicalSpecialist && isCRM && isNotIrrelevant;
      })
      .map((post: any) => {
        let jobUrl = post.positionUrl || `https://bostonscientific.eightfold.ai/careers?job=${post.id}`;
        if (jobUrl.startsWith('/')) {
          jobUrl = `https://bostonscientific.eightfold.ai${jobUrl}`;
        }

        return {
          id: post.id || post.displayJobId,
          title: post.name,
          company: 'Boston Scientific',
          location: post.locations?.[0] || 'Unknown',
          url: jobUrl,
          datePosted: post.postedTs ? new Date(post.postedTs * 1000).toISOString() : undefined,
        };
      });
  }
}
