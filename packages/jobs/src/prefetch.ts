import { fetchAllJobs } from './index';
import fs from 'node:fs/promises';
import path from 'node:path';

async function main() {
  const outputPath = process.argv[2];
  if (!outputPath) {
    console.error('Usage: tsx prefetch-jobs.ts <output-path>');
    process.exit(1);
  }

  console.log('Prefetching all jobs...');
  // Force refresh to bypass any library-level caching
  const jobs = await fetchAllJobs({ forceRefresh: true });
  
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(jobs, null, 2));
  
  console.log(`Successfully saved ${jobs.length} jobs to ${outputPath}`);
}

main().catch(console.error);
