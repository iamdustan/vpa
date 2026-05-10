import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MedtronicFetcher } from './medtronic';
import medtronicFixture from './__fixtures__/medtronic-raw.json';

describe('MedtronicFetcher', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(medtronicFixture),
    }));
  });

  it('should fetch and normalize job postings from Medtronic (Workday) using fixture', async () => {
    const fetcher = new MedtronicFetcher();
    const jobs = await fetcher.fetch('In Training');

    expect(jobs).toBeInstanceOf(Array);
    expect(jobs.length).toBeGreaterThan(0);
    
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

    const job = jobs[0];
    expect(job.company).toBe('Medtronic');
    expect(job.id).toBeDefined();
    expect(job.url).toContain('medtronic.wd1.myworkdayjobs.com');
  });

  it('should correctly filter "In Training" roles from fixture', async () => {
    const fetcher = new MedtronicFetcher();
    const jobs = await fetcher.fetch('In Training');

    // From our captured fixture, we know there are specific "In Training" roles
    const trainingJobs = jobs.filter(j => j.title.toLowerCase().includes('in training'));
    expect(trainingJobs.length).toBeGreaterThan(0);
    
    trainingJobs.forEach(job => {
      const title = job.title.toLowerCase();
      const isCRM = title.includes('crm') || title.includes('cardiac rhythm');
      const isCAS = title.includes('cas') || title.includes('cardiac ablation');
      const isMapping = title.includes('mapping');
      expect(isCRM || isCAS || isMapping).toBe(true);
    });
  });
});
