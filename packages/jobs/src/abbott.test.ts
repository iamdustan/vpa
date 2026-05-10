import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AbbottFetcher } from './abbott';
import abbottFixture from './__fixtures__/abbott-raw.json';

describe('AbbottFetcher', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(abbottFixture),
    }));
  });

  it('should fetch and normalize job postings from Abbott (Phenom) using fixture', async () => {
    const fetcher = new AbbottFetcher();
    const jobs = await fetcher.fetch('Clinical Specialist CRM');

    expect(jobs).toBeInstanceOf(Array);
    expect(jobs.length).toBeGreaterThan(0);
    
    // Ensure strict filtering
    const irrelevantJobs = jobs.filter(j => {
      const title = (j.title || '').toLowerCase();
      const isClinical = title.includes('clinical specialist') || title.includes('clinical associate');
      const isIrrelevant = title.includes('senior') || title.includes('principal') || title.includes('manager');
      return !isClinical || isIrrelevant;
    });
    expect(irrelevantJobs.length).toBe(0);

    const job = jobs[0];
    expect(job.company).toBe('Abbott');
    expect(job.id).toBeDefined();
    expect(job.url).toContain('jobs.abbott');
  });
});
