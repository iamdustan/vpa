import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { fetchAllJobs, type JobPost } from '@vpa/jobs';
import * as dotenv from 'dotenv';

dotenv.config();

export async function getDoc() {
  const {
    GOOGLE_SERVICE_ACCOUNT_EMAIL,
    GOOGLE_PRIVATE_KEY,
    SPREADSHEET_ID,
  } = process.env;

  if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || !SPREADSHEET_ID) {
    throw new Error('Missing environment variables. Please check your .env file.');
  }

  const serviceAccountAuth = new JWT({
    email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
  await doc.loadInfo();
  return doc;
}

export async function syncJobsToSheet(doc: GoogleSpreadsheet, sheetTitle: string, jobs: JobPost[]) {
  let sheet = doc.sheetsByTitle[sheetTitle];
  const header = ['id', 'title', 'company', 'location', 'url', 'datePosted'];

  if (!sheet) {
    console.log(`Creating "${sheetTitle}" sheet...`);
    sheet = await doc.addSheet({
      title: sheetTitle,
      headerValues: header,
    });
  } else {
    console.log(`Resetting existing sheet "${sheetTitle}"...`);
    await sheet.clear();
  }

  console.log(`Updating Google Sheet "${sheetTitle}" with ${jobs.length} jobs...`);

  // We use cell-based updates to ensure we start at row 1 and replace everything
  await sheet.loadCells({
    startRowIndex: 0,
    endRowIndex: jobs.length + 1,
    startColumnIndex: 0,
    endColumnIndex: header.length,
  });

  // Set header
  for (let i = 0; i < header.length; i++) {
    sheet.getCell(0, i).value = header[i];
  }

  // Set data
  for (let r = 0; r < jobs.length; r++) {
    const job = jobs[r];
    const rowValues = [
      job.id,
      job.title,
      job.company,
      job.location,
      job.url,
      job.datePosted || '',
    ];
    for (let c = 0; c < rowValues.length; c++) {
      sheet.getCell(r + 1, c).value = rowValues[c];
    }
  }

  await sheet.saveUpdatedCells();

  // Resize the sheet to fit the data exactly, which removes any leftover rows
  // We use Math.max(2, ...) to ensure at least one non-frozen row if the header is frozen
  await sheet.resize({
    rowCount: Math.max(2, jobs.length + 1),
    columnCount: header.length,
  });
}

async function runSync() {
  try {
    const doc = await getDoc();
    console.log(`Connected to: ${doc.title}`);
    
    console.log('Fetching filtered jobs...');
    const filteredJobs = await fetchAllJobs();
    await syncJobsToSheet(doc, 'Current Jobs', filteredJobs);

    console.log('Fetching all jobs for review...');
    const allJobs = await fetchAllJobs({ unfiltered: true });
    await syncJobsToSheet(doc, 'Review Jobs', allJobs);
    
    console.log('Sync complete!');
  } catch (err) {
    console.error('Sync failed:', err);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runSync();
}
