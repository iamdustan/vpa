import { AbbottFetcher } from './abbott';

async function main() {
  const query = 'Clinical Specialist CRM';
  console.log(`Searching for "${query}" at Abbott...\n`);
  
  const fetcher = new AbbottFetcher();
  try {
    const jobs = await fetcher.fetch(query);
    console.log(`Found ${jobs.length} jobs:\n`);
    jobs.forEach((job, i) => {
      console.log(`${i + 1}. ${job.title}`);
      console.log(`   Location: ${job.location}`);
      console.log(`   URL: ${job.url}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
  }
}

main();
