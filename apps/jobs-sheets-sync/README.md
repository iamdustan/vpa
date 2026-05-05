# Jobs Sheets Sync

This application fetches job postings from various medical device companies (via `@vpa/jobs`) and syncs them to a Google Sheet.

## Setup

1. **Google Cloud Project**:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/).
   - Enable the **Google Sheets API**.
   - Create a **Service Account** under "IAM & Admin" > "Service Accounts".
   - Create a **JSON Key** for that service account and download it.

2. **Environment Variables**:
   - Copy `.env.example` to `.env`.
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`: The `client_email` from your JSON key.
   - `GOOGLE_PRIVATE_KEY`: The `private_key` from your JSON key.
   - `SPREADSHEET_ID`: The ID from your Google Sheet URL (the part between `/d/` and `/edit`).

3. **Share the Sheet**:
   - Open your Google Sheet.
   - Click **Share** and add your Service Account email with **Editor** permissions.

## Usage

Run the sync script:

```bash
npm run start
```

To run tests:

```bash
npm run test
```
