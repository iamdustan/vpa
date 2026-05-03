import { Command } from 'commander';
import { MedtronicFetcher } from './medtronic';
import { AbbottFetcher } from './abbott';
import { BostonScientificFetcher } from './boston';
import { BiotronikFetcher } from './biotronik';

const program = new Command();

program
  .name('jobs')
  .description('CLI to fetch job postings from medical device companies')
  .version('0.0.1');

program
  .command('fetch')
  .description('Fetch jobs from a provider')
  .argument('<provider>', 'Company to fetch from (medtronic, abbott, boston, biotronik)')
  .option('-q, --query <query>', 'Search query', 'Clinical Specialist CRM')
  .action(async (provider, options) => {
    let fetcher;

    switch (provider.toLowerCase()) {
      case 'medtronic':
        fetcher = new MedtronicFetcher();
        break;
      case 'abbott':
        fetcher = new AbbottFetcher();
        break;
      case 'boston':
      case 'boston-scientific':
        fetcher = new BostonScientificFetcher();
        break;
      case 'biotronik':
        fetcher = new BiotronikFetcher();
        break;
      default:
        console.error(`Unknown provider: ${provider}`);
        process.exit(1);
    }

    console.log(`Searching at ${provider}...\n`);

    try {
      const queries = provider.toLowerCase() === 'medtronic' 
        ? ['Field Inventory Analyst', 'Clinical Specialist (CAS)', 'Clinical Specialist Cardiac Rhythm']
        : [options.query];

      const allJobs: JobPost[] = [];
      for (const q of queries) {
        const jobs = await fetcher.fetch(q);
        allJobs.push(...jobs);
      }
      
      // Deduplicate by ID
      const uniqueJobs = Array.from(new Map(allJobs.map(j => [j.id, j])).values());

      if (uniqueJobs.length === 0) {
        console.log('No jobs found.');
        return;
      }

      // Group by title
      const groupedJobs = uniqueJobs.reduce((acc, job) => {
        if (!acc[job.title]) acc[job.title] = [];
        acc[job.title].push(job);
        return acc;
      }, {} as Record<string, JobPost[]>);

      Object.entries(groupedJobs).forEach(([title, jobs]) => {
        console.log(`\x1b[1m${title}\x1b[0m (${jobs.length} positions)`);
        jobs.forEach((job) => {
          console.log(`   Location: ${job.location}`);
          console.log(`   URL: ${job.url}`);
          console.log(`   ID: ${job.id}`);
          console.log(`   Posted: ${job.datePosted}`);
          console.log('---');
        });
        console.log();
      });
      
      console.log(`\nFound ${uniqueJobs.length} unique jobs.`);
    } catch (error) {
      console.error('Error fetching jobs:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();
