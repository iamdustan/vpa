import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MedtronicFetcher } from './medtronic';

describe('MedtronicFetcher', () => {
  it('should fetch and normalize job postings from Medtronic (Workday)', async () => {
    const fetcher = new MedtronicFetcher();
    const jobs = await fetcher.fetch('Clinical Specialist CRM');

    expect(jobs).toBeInstanceOf(Array);
    
    // Ensure we don't have irrelevant roles like "Software Safety Engineer"
    const irrelevantJobs = jobs.filter(j => 
      j.title.toLowerCase().includes('software') || 
      j.title.toLowerCase().includes('marketing') ||
      j.title.toLowerCase().includes('research')
    );
    expect(irrelevantJobs.length).toBe(0);

    if (jobs.length > 0) {
      const job = jobs[0];
      expect(job.company).toBe('Medtronic');
      // Should be a Clinical Specialist role
      expect(job.title.toLowerCase()).toContain('clinical specialist');
      // Should relate to CRM
      expect(job.title.toLowerCase()).toContain('crm');
      expect(job.id).toBeDefined();
      expect(job.url).toContain('medtronic.wd1.myworkdayjobs.com');
    }
  });
});
