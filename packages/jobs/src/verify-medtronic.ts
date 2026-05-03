import { MedtronicFetcher } from './medtronic';

async function main() {
  const query = 'Clinical Specialist CRM';
  console.log(`Searching for "${query}" at Medtronic...\n`);
  
  const fetcher = new MedtronicFetcher();
  try {
    const jobs = await fetcher.fetch(query);
    console.log(`Found ${jobs.length} jobs:\n`);
    jobs.forEach((job, i) => {
      console.log(`${i + 1}. ${job.title}`);
      console.log(`   Location: ${job.location}`);
      console.log(`   URL: ${job.url}`);
      console.log(`   ID: ${job.id}`);
      console.log(`   Posted: ${job.datePosted}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
  }
}

main();
