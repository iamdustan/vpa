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
    queries: ['Field Inventory Analyst', 'Clinical Specialist (CAS)', 'Clinical Specialist Cardiac Rhythm'],
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
  forceRefresh?: boolean // Kept for API compatibility
} = {}): Promise<JobPost[]> {
  
  const providersToFetch = options.providers || (Object.keys(PROVIDERS) as (keyof typeof PROVIDERS)[]);
  const allResults: JobPost[] = [];

  for (const p of providersToFetch) {
    const config = PROVIDERS[p];
    const fetcher = new config.fetcher();
    
    for (const q of config.queries) {
      try {
        const jobs = await fetcher.fetch(q);
        allResults.push(...jobs);
      } catch (error) {
        console.error(`Error fetching from ${p} for "${q}":`, error);
      }
    }
  }

  return Array.from(new Map(allResults.map(j => [j.id, j])).values());
}
