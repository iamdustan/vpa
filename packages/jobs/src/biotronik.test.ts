import { describe, it, expect } from 'vitest';
import { BiotronikFetcher } from './biotronik';

describe('BiotronikFetcher', () => {
  it('should fetch jobs from Biotronik using Playwright', async () => {
    const fetcher = new BiotronikFetcher();
    // Use a common keyword that is likely to have results
    const jobs = await fetcher.fetch('Clinical Specialist');

    expect(jobs).toBeInstanceOf(Array);
    
    if (jobs.length > 0) {
      const job = jobs[0];
      expect(job.company).toBe('Biotronik');
      expect(job.id).toBeDefined();
      expect(job.url).toContain('successfactors.eu');
      expect(job.title.toLowerCase()).toContain('clinical');
      expect(job.location).toBeDefined();
    }
  }, 60000); // High timeout for browser automation
});
