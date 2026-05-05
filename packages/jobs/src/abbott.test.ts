import { describe, it, expect } from 'vitest';
import { AbbottFetcher } from './abbott';

describe('AbbottFetcher', () => {
  it('should fetch and normalize job postings from Abbott (Phenom)', async () => {
    const fetcher = new AbbottFetcher();
    const jobs = await fetcher.fetch('Clinical Specialist CRM');

    expect(jobs).toBeInstanceOf(Array);
    
    // Ensure strict filtering
    const irrelevantJobs = jobs.filter(j => {
      const title = j.title.toLowerCase();
      const matchesInclusion = (title.includes('clinical specialist') && (title.includes('crm') || title.includes('cardiac rhythm'))) ||
                               title.includes('clinical associate');
      const matchesExclusion = title.includes('senior') || title.includes('principal') || title.includes('manager');
      return !matchesInclusion || matchesExclusion;
    });
    expect(irrelevantJobs.length).toBe(0);

    if (jobs.length > 0) {
      const job = jobs[0];
      expect(job.company).toBe('Abbott');
      expect(job.title.toLowerCase()).toContain('clinical specialist');
      expect(job.id).toBeDefined();
      expect(job.url).toContain('jobs.abbott');
    }
  });
});
