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

    const data = await response.json();
    
    // Based on inspection of globalSearchEventV3 response:
    const rawJobs = data.globalSearchEventV3?.jobTitles?.data?.titles ||
                    data.globalSearchEventV3?.data?.jobs || 
                    data.globalSearchEventV3?.jobs ||
                    data.refineSearch?.data?.jobs || 
                    data.refineSearch?.hits ||
                    [];

    return rawJobs
      .filter((post: any) => {
        if (options?.unfiltered) return true;

        const title = (post.title || '').toLowerCase();
        // Strict filtering: Clinical Specialist and CRM related OR Clinical Associate
        const isClinicalSpecialist = title.includes('clinical specialist');
        const isCRM = title.includes('crm') || title.includes('cardiac rhythm');
        const isClinicalAssociate = title.includes('clinical associate');
        
        const isNotIrrelevant = !title.includes('research') && 
                                !title.includes('marketing') && 
                                !title.includes('software') &&
                                !title.includes('senior') &&
                                !title.includes('sr ') &&
                                !title.includes('sr.') &&
                                !title.includes('principal') &&
                                !title.includes('manager') &&
                                !title.includes('leadless');

        return ((isClinicalSpecialist && isCRM) || isClinicalAssociate) && isNotIrrelevant;
      })
      .map((post: any) => ({
        id: post.jobId || post.jobSeqNo || post.reqId,
        title: post.title,
        company: 'Abbott',
        location: post.location || post.cityStateCountry || post.postedLocation,
        url: `https://www.jobs.abbott/us/en/job/${post.jobId || post.jobSeqNo || post.reqId}`,
        datePosted: post.postedDate || post.datePosted,
      }));
  }
}
