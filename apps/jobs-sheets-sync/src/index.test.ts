import { describe, it, expect, beforeAll } from 'vitest';
import { getDoc, syncJobsToSheet } from './index';
import type { JobPost } from '@vpa/jobs';

// Note: This test requires valid environment variables to run.
// If they are missing, the test will skip or fail gracefully.
describe('Google Sheets Sync Integration', () => {
  let doc: any;

  beforeAll(async () => {
    try {
      doc = await getDoc();
    } catch (e) {
      // In a real CI environment, we'd skip or fail. 
      // For this local setup, we'll just log and let the test fail if it actually tries to run.
      console.warn('Google Sheets credentials not found. Integration tests will fail if they run.');
    }
  });

  it('should write and read back job data', async () => {
    if (!doc) {
      console.log('Skipping test: No Google Sheets document connection.');
      return;
    }

    const testJobs: JobPost[] = [
      {
        id: 'test-1',
        title: 'Software Engineer',
        company: 'Test Corp',
        location: 'Remote',
        url: 'https://example.com/test-1',
        datePosted: '2023-01-01'
      },
      {
        id: 'test-2',
        title: 'Product Manager',
        company: 'Test Inc',
        location: 'New York',
        url: 'https://example.com/test-2'
      }
    ];

    const testSheetTitle = 'Test Sync';
    
    // Sync to test sheet
    await syncJobsToSheet(doc, testSheetTitle, testJobs);

    // Read back from test sheet
    const sheet = doc.sheetsByTitle[testSheetTitle];
    const rows = await sheet.getRows();

    expect(rows.length).toBe(2);
    // In v4, rows have properties corresponding to headers
    expect(rows[0].get('id')).toBe('test-1');
    expect(rows[0].get('title')).toBe('Software Engineer');
    expect(rows[1].get('id')).toBe('test-2');
    expect(rows[1].get('title')).toBe('Product Manager');
  });
});
