import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BostonScientificFetcher } from './boston';
import bostonFixture from './__fixtures__/boston-raw.json';

describe('BostonScientificFetcher', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(bostonFixture),
    }));
  });

  it('should fetch and normalize job postings from Boston Scientific (Eightfold) using fixture', async () => {
    const fetcher = new BostonScientificFetcher();
    const jobs = await fetcher.fetch('Clinical Specialist CRM');

    expect(jobs).toBeInstanceOf(Array);
    expect(jobs.length).toBeGreaterThan(0);
    
    // Ensure strict filtering
    const irrelevantJobs = jobs.filter(j => {
      const title = j.title.toLowerCase();
      const isClinicalRole = title.includes('clinical specialist') || 
                             title.includes('clinical representative') ||
                             title.includes('mapping specialist');
      const isCRM = title.includes('crm') || title.includes('cardiac rhythm') || title.includes('ep ') || title.includes('electrophysiology') || title.includes('mapping');
      const isExcluded = title.includes('senior') || title.includes('principal') || title.includes('manager');
      return !isClinicalRole || !isCRM || isExcluded;
    });
    expect(irrelevantJobs.length).toBe(0);

    const job = jobs[0];
    expect(job.company).toBe('Boston Scientific');
    const title = job.title.toLowerCase();
    expect(title.includes('clinical specialist') || title.includes('clinical representative') || title.includes('mapping specialist')).toBe(true);
    expect(job.id).toBeDefined();
    expect(job.url).toContain('eightfold.ai');
  });
});