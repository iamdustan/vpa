import { Command } from 'commander';
import { fetchAllJobs, PROVIDERS } from './index';
import type { JobPost } from './types';

const program = new Command();

program
  .name('jobs')
  .description('CLI to fetch job postings from medical device companies')
  .version('0.0.1');

program
  .command('fetch')
  .description('Fetch jobs from a provider or all providers')
  .argument('[provider]', 'Company to fetch from (medtronic, abbott, boston, biotronik, all)', 'all')
  .option('-q, --query <query>', 'Search query (if not using "all" or specific provider defaults)')
  .action(async (providerArg, options) => {
    const providerKey = providerArg.toLowerCase();
    
    if (providerKey !== 'all' && !PROVIDERS[providerKey as keyof typeof PROVIDERS]) {
      console.error(`Unknown provider: ${providerArg}`);
      process.exit(1);
    }

    console.log(`\nSearching at ${providerArg}...\n`);

    try {
      let uniqueJobs: JobPost[];

      if (options.query && providerKey !== 'all') {
        // Handle specific manual query
        const config = PROVIDERS[providerKey as keyof typeof PROVIDERS];
        const fetcher = new config.fetcher();
        uniqueJobs = await fetcher.fetch(options.query);
      } else {
        // Use unified library function for default presets
        uniqueJobs = await fetchAllJobs({ 
          providers: providerKey === 'all' ? undefined : [providerKey as keyof typeof PROVIDERS] 
        });
      }

      if (uniqueJobs.length === 0) {
        console.log('\nNo jobs found.');
        return;
      }

      console.log(`\x1b[1m\x1b[32m=== RESULTS SUMMARY ===\x1b[0m`);
      
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
      
      console.log(`\n\x1b[32mFound ${uniqueJobs.length} unique jobs.\x1b[0m`);
    } catch (error) {
      console.error('Error fetching jobs:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();

program.parse();
