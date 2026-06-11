# Anchor Email Worker

This is a Cloudflare Worker that handles email and push notification tasks for the Anchor Bible Reading Tracker.

## Local Development

To run the worker locally, Wrangler uses the `.dev.vars` file for environment secrets. This file is git-ignored to prevent exposing sensitive keys.

1. Create a `.dev.vars` file in this directory:
   ```env
   RESEND_API_KEY="your-resend-api-key"
   ONESIGNAL_REST_API_KEY="your-onesignal-rest-api-key"
   ```
2. Run wrangler local development server:
   ```bash
   npx wrangler dev
   ```

## Production Deployment

To set production secrets in Cloudflare:

Run the following commands in this directory:
```bash
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put ONESIGNAL_REST_API_KEY
```

Then deploy the worker:
```bash
npx wrangler deploy
```
