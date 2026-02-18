# notion-proxy

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

Serverless proxy for Notion API on Netlify Functions.

## What it does

- Accepts requests at `/api/*` and forwards them to `https://api.notion.com`.
- Uses `Authorization: Bearer <NOTION_API_KEY>` from incoming request headers.
- Allows passing target endpoint and payload from request body.
- Exposes debug endpoint `/.netlify/functions/redirects` with in-memory request log.

## Request format

`POST /.netlify/functions/notion-proxy`

Headers:

- `Authorization: Bearer <your_notion_api_key>`
- `Content-Type: application/json`

Body example:

```json
{
  "endpoint": "/v1/databases/<database_id>/query",
  "method": "POST",
  "body": {
    "page_size": 10
  }
}
```

## Local run

```bash
npm install
npx netlify dev
```

## Notes

- Proxy does not persist logs; `redirects` are stored in memory only.
- Keep Notion API keys in request headers or your deployment secrets, never in repository files.
