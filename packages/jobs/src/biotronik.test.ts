import { describe, it, expect } from 'vitest';
import { BiotronikFetcher } from './biotronik';

describe('BiotronikFetcher', () => {
  it('should fetch and normalize job postings from Biotronik (SuccessFactors)', async () => {
    const fetcher = new BiotronikFetcher();
    const jobs = await fetcher.fetch('Clinical Specialist CRM');

    expect(jobs).toBeInstanceOf(Array);
    
    // Ensure strict filtering
    const irrelevantJobs = jobs.filter(j => {
      const title = j.title.toLowerCase();
      const isClinicalRole = title.includes('clinical specialist') || title.includes('field clinical');
      const isCRM = title.includes('crm') || title.includes('cardiac rhythm');
      return !isClinicalRole || !isCRM;
    });
    expect(irrelevantJobs.length).toBe(0);

    if (jobs.length > 0) {
      const job = jobs[0];
      expect(job.company).toBe('Biotronik');
      const title = job.title.toLowerCase();
      expect(title.includes('clinical specialist') || title.includes('field clinical')).toBe(true);
      expect(job.id).toBeDefined();
      expect(job.url).toContain('successfactors');
    }
  });
});
