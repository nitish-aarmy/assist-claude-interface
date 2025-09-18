# Claude API Wrapper for GCP

## Setup

1. Install dependencies:
   ```powershell
   cd gcp-endpoint; npm install
   ```

2. Set environment variables:
   - `CLAUDE_API_KEY`: Your Claude API key
   - `ENDPOINT_API_KEY`: Key for clients to access your endpoint

3. Local run:
   ```powershell
   $env:CLAUDE_API_KEY="your_claude_key"; $env:ENDPOINT_API_KEY="your_endpoint_key"; node index.js
   ```

## Deploy to Google Cloud Functions

1. Install Google Cloud SDK and authenticate.
2. Deploy:
   ```powershell
   gcloud functions deploy claudeProxy --runtime nodejs18 --trigger-http --entry-point=app --allow-unauthenticated
   ```
   - Set environment variables in GCP console or via `--set-env-vars`.

## Deploy to Cloud Run

1. Build and deploy:
   ```powershell
   gcloud builds submit --tag gcr.io/PROJECT_ID/claude-gcp-endpoint
   gcloud run deploy claude-gcp-endpoint --image gcr.io/PROJECT_ID/claude-gcp-endpoint --platform managed --allow-unauthenticated
   ```
   - Set environment variables in Cloud Run settings.

## Security
- Protect your endpoint with `ENDPOINT_API_KEY`.
- Use IAM for advanced access control.
