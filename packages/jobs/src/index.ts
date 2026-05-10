import { MedtronicFetcher } from './medtronic';
import { AbbottFetcher } from './abbott';
import { BostonScientificFetcher } from './boston';
import { BiotronikFetcher } from './biotronik';
import type { JobPost, JobFetcher } from './types';

export * from './types';
export { MedtronicFetcher, AbbottFetcher, BostonScientificFetcher, BiotronikFetcher };

export const PROVIDERS: Record<string, { fetcher: new () => JobFetcher; queries: string[] }> = {
  medtronic: {
    fetcher: MedtronicFetcher,
    queries: [
      'Field Inventory Analyst',
      'Clinical Specialist (CAS)',
      'Clinical Specialist Cardiac Rhythm',
      'Affera Mapping Specialist',
      'In Training',
    ],
  },
  abbott: {
    fetcher: AbbottFetcher,
    queries: ['Clinical Specialist CRM', 'Clinical Associate'],
  },
  boston: {
    fetcher: BostonScientificFetcher,
    queries: [
      'Clinical Specialist CRM',
      'CRM Field Clinical Representative',
      'Ep Mapping clinical specialist',
    ],
  },
  biotronik: {
    fetcher: BiotronikFetcher,
    queries: ['Field Clinical Specialist'],
  },
};

/**
 * Unified API to fetch jobs from all or specific providers with their default expert-tuned queries.
 */
export async function fetchAllJobs(options: { 
  providers?: (keyof typeof PROVIDERS)[],
  forceRefresh?: boolean, // Kept for API compatibility
  unfiltered?: boolean
} = {}): Promise<JobPost[]> {
  
  const providersToFetch = options.providers || (Object.keys(PROVIDERS) as (keyof typeof PROVIDERS)[]);
  
  const providerPromises = providersToFetch.map(async (p) => {
    const config = PROVIDERS[p];
    const fetcher = new config.fetcher();
    
    // Within each provider, we still run queries sequentially to be nice to their APIs
    const providerResults: JobPost[] = [];
    for (const q of config.queries) {
      try {
        const jobs = await fetcher.fetch(q, { unfiltered: options.unfiltered });
        providerResults.push(...jobs);
      } catch (error) {
        console.error(`Error fetching from ${p} for "${q}":`, error);
      }
    }
    return providerResults;
  });

  const settleResults = await Promise.allSettled(providerPromises);
  const allResults: JobPost[] = [];

  for (const res of settleResults) {
    if (res.status === 'fulfilled') {
      allResults.push(...res.value);
    }
  }

  // Deduplicate by ID
  return Array.from(new Map(allResults.map(j => [j.id, j])).values());
}
