---
name: job-sync
description: Fetches latest medical device job postings and syncs them to the Google Sheet. Use when asked to update current job listings, refresh jobs, or sync jobs to the spreadsheet.
---

# Job Sync

This skill automates the two-step process of refreshing job data and syncing it to the Google Sheet for Virtual Pacing Academy.

## Workflow

To update the job listings and sync to the spreadsheet, follow these steps sequentially:

1. **Refresh Job Data**:
   Execute the prefetch script to update the local `jobs.json` file.
   ```bash
   npm run jobs:refresh
   ```

2. **Sync to Google Sheets**:
   Execute the `jobs-sheets-sync` application to push the updated data to the Google Sheet.
   ```bash
   npm run start --workspace=@vpa/jobs-sheets-sync
   ```

## Troubleshooting

- **Authentication Error**: If the sync fails with `DECODER routines::unsupported`, ensure the `GOOGLE_PRIVATE_KEY` in `apps/jobs-sheets-sync/.env` is wrapped in double quotes and includes the full key with `\n` characters preserved.
- **404 Not Found**: Verify that the `SPREADSHEET_ID` in `apps/jobs-sheets-sync/.env` is correct and that the service account email has been shared with the sheet as an "Editor".
