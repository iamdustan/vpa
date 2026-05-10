import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MedtronicFetcher } from './medtronic';

describe('MedtronicFetcher', () => {
  it('should fetch and normalize job postings from Medtronic (Workday)', async () => {
    const fetcher = new MedtronicFetcher();
    const jobs = await fetcher.fetch('Clinical Specialist CRM');

    expect(jobs).toBeInstanceOf(Array);
    
    // Ensure we don't have irrelevant roles
    const irrelevantJobs = jobs.filter(j => {
      const title = j.title.toLowerCase();
      const isIrrelevant = title.includes('software') || 
                           title.includes('marketing') ||
                           title.includes('research') ||
                           title.includes('senior') ||
                           title.includes('principal') ||
                           title.includes('manager');
      return isIrrelevant;
    });
    expect(irrelevantJobs.length).toBe(0);

    if (jobs.length > 0) {
      const job = jobs[0];
      expect(job.company).toBe('Medtronic');
      // Should be a Clinical Specialist role
      expect(job.title.toLowerCase()).toMatch(/clinical spec(ialist)?/);
      // Should relate to CRM
      expect(job.title.toLowerCase()).toContain('crm');
      expect(job.id).toBeDefined();
      expect(job.url).toContain('medtronic.wd1.myworkdayjobs.com');
    }
  });

  it('should fetch "In Training" roles', async () => {
    const fetcher = new MedtronicFetcher();
    const jobs = await fetcher.fetch('In Training');

    expect(jobs).toBeInstanceOf(Array);
    
    // Some "In Training" roles might be Mapping Specialists or CAS, not just "Clinical Specialist"
    // Note: Workday search might return other relevant roles (like Field Inventory Analyst) for this query
    jobs.forEach(job => {
      const title = job.title.toLowerCase();
      
      // Should be one of our target categories
      const isCRM = title.includes('crm') || title.includes('cardiac rhythm');
      const isCAS = title.includes('cas') || title.includes('cardiac ablation');
      const isMapping = title.includes('mapping');
      const isInventory = title.includes('field inventory analyst');
      const isInTraining = title.includes('in training');
      
      expect(isCRM || isCAS || isMapping || isInventory || isInTraining).toBe(true);
    });
  });
});
