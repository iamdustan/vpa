import { Command } from 'commander';
import { MedtronicFetcher } from './medtronic';
import { AbbottFetcher } from './abbott';
import { BostonScientificFetcher } from './boston';
import { BiotronikFetcher } from './biotronik';
import type { JobFetcher, JobPost } from './types';

const PROVIDERS: Record<string, { fetcher: new () => JobFetcher; queries: string[] }> = {
  medtronic: {
    fetcher: MedtronicFetcher,
    queries: ['Field Inventory Analyst', 'Clinical Specialist (CAS)', 'Clinical Specialist Cardiac Rhythm'],
  },
  abbott: {
    fetcher: AbbottFetcher,
    queries: ['Clinical Specialist CRM', 'Clinical Associate'],
  },
  boston: {
    fetcher: BostonScientificFetcher,
    queries: ['Clinical Specialist CRM', 'Field Clinical Representative CRM'],
  },
  biotronik: {
    fetcher: BiotronikFetcher,
    queries: ['Clinical Specialist'],
  },
};

const program = new Command();

program
  .name('jobs')
  .description('CLI to fetch job postings from medical device companies')
  .version('0.0.1');

program
  .command('fetch')
  .description('Fetch jobs from a provider or all providers')
  .argument('[provider]', 'Company to fetch from (medtronic, abbott, boston, biotronik, all)', 'all')
  .option('-q, --query <query>', 'Search query (if not using "all" or specific provider defaults)', 'Clinical Specialist CRM')
  .action(async (providerArg, options) => {
    const providersToFetch = providerArg.toLowerCase() === 'all'
      ? Object.keys(PROVIDERS)
      : [providerArg.toLowerCase()];

    const allResults: JobPost[] = [];

    for (const p of providersToFetch) {
      const config = PROVIDERS[p];
      if (!config) {
        console.error(`Unknown provider: ${p}`);
        continue;
      }

      console.log(`\n\x1b[36m--- Fetching from ${p.toUpperCase()} ---\x1b[0m`);
      const fetcher = new config.fetcher();
      
      const queries = (providerArg.toLowerCase() === 'all' || !options.query)
        ? config.queries 
        : [options.query];

      for (const q of queries) {
        console.log(`Searching for "${q}"...`);
        try {
          const jobs = await fetcher.fetch(q);
          allResults.push(...jobs);
        } catch (error) {
          console.error(`Error fetching from ${p} for "${q}":`, error instanceof Error ? error.message : error);
        }
      }
    }

    const uniqueJobs = Array.from(new Map(allResults.map(j => [j.id, j])).values());

    if (uniqueJobs.length === 0) {
      console.log('\nNo jobs found across all requested providers.');
      return;
    }

    console.log(`\n\x1b[1m\x1b[32m=== RESULTS SUMMARY ===\x1b[0m`);
    
    const groupedByCompany = uniqueJobs.reduce((acc, job) => {
      if (!acc[job.company]) acc[job.company] = {};
      if (!acc[job.company][job.title]) acc[job.company][job.title] = [];
      acc[job.company][job.title].push(job);
      return acc;
    }, {} as Record<string, Record<string, JobPost[]>>);

    Object.entries(groupedByCompany).forEach(([company, titles]) => {
      console.log(`\n\x1b[35m[${company}]\x1b[0m`);
      Object.entries(titles).forEach(([title, jobs]) => {
        console.log(`  \x1b[1m${title}\x1b[0m (${jobs.length} positions)`);
        jobs.forEach((job) => {
          console.log(`     Location: ${job.location}`);
          console.log(`     URL: ${job.url}`);
          console.log(`     ID: ${job.id}`);
          if (job.datePosted) console.log(`     Posted: ${job.datePosted}`);
          console.log('     ---');
        });
      });
    });
    
    console.log(`\n\x1b[32mFound ${uniqueJobs.length} unique jobs across ${Object.keys(groupedByCompany).length} companies.\x1b[0m`);
  });

program.parse();
