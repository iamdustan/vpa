import { Command } from 'commander';
import { MedtronicFetcher } from './medtronic';
import { AbbottFetcher } from './abbott';
import { BostonScientificFetcher } from './boston';

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
      default:
        console.error(`Unknown provider: ${provider}`);
        process.exit(1);
    }

    console.log(`Searching for "${options.query}" at ${provider}...\n`);

    try {
      const jobs = await fetcher.fetch(options.query);
      
      if (jobs.length === 0) {
        console.log('No jobs found.');
        return;
      }

      jobs.forEach((job, i) => {
        console.log(`${i + 1}. ${job.title}`);
        console.log(`   Location: ${job.location}`);
        console.log(`   URL: ${job.url}`);
        console.log(`   ID: ${job.id}`);
        console.log(`   Posted: ${job.datePosted}`);
        console.log('---');
      });
      
      console.log(`\nFound ${jobs.length} jobs.`);
    } catch (error) {
      console.error('Error fetching jobs:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();
