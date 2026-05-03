import type { JobFetcher, JobPost } from './types';

export class MedtronicFetcher implements JobFetcher {
  private readonly baseUrl = 'https://medtronic.wd1.myworkdayjobs.com/wday/cxs/medtronic/MedtronicCareers/jobs';

  async fetch(query: string): Promise<JobPost[]> {
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

    const data = await response.json();
    const rawJobs = data.jobPostings || [];
    
    return rawJobs
      .filter((post: any) => {
        const title = post.title.toLowerCase();
        const location = post.locationsText.toLowerCase();

        // Filter for US only
        const isUS = location.includes('united states') || location.includes('usa');
        if (!isUS) return false;

        // Strict filtering: must be a Clinical Specialist and must be CRM related OR Field Inventory Analyst OR CAS related
        const isClinicalSpecialist = title.includes('clinical specialist');
        const isCRM = title.includes('crm') || title.includes('cardiac rhythm');
        const isCAS = title.includes('(cas)') || title.includes(' cas') || title.includes('cas ') || title.includes('cardiac ablation solutions');
        const isMappingSpecialist = title.includes('mapping specialist');
        const isInventoryAnalyst = title.includes('field inventory analyst');
        
        // Exclude research, marketing, or software specific roles that aren't field clinical roles
        const isNotIrrelevant = !title.includes('research') && 
                                !title.includes('marketing') && 
                                !title.includes('software');

        return (isClinicalSpecialist && (isCRM || isCAS) && isNotIrrelevant) || 
               (isMappingSpecialist && isCAS && isNotIrrelevant) ||
               isInventoryAnalyst;
      })
      .map((post: any) => ({
        id: post.bulletinNumber || post.externalPath,
        title: post.title,
        company: 'Medtronic',
        location: post.locationsText,
        url: `https://medtronic.wd1.myworkdayjobs.com/MedtronicCareers${post.externalPath}`,
        datePosted: post.postedOn,
      }));
  }
}
