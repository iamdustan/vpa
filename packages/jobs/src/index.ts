export * from './types';
export { MedtronicFetcher } from './medtronic';
export { AbbottFetcher } from './abbott';
export { BostonScientificFetcher } from './boston';
export { BiotronikFetcher } from './biotronik';

import { MedtronicFetcher } from './medtronic';
import { AbbottFetcher } from './abbott';
import { BostonScientificFetcher } from './boston';
import { BiotronikFetcher } from './biotronik';
import type { JobPost } from './types';

export const PROVIDERS = {
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
} as const;

/**
 * Unified API to fetch jobs from all or specific providers with their default expert-tuned queries.
 */
export async function fetchAllJobs(options: { providers?: (keyof typeof PROVIDERS)[] } = {}): Promise<JobPost[]> {
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

  // Deduplicate by ID
  return Array.from(new Map(allResults.map(j => [j.id, j])).values());
}
