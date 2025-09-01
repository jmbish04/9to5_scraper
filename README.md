# Rendered Web Job Scraper

Monorepo for a Cloudflare Worker job scraper and Next.js dashboard.

## Development

```sh
pnpm install
pnpm build
pnpm test
```

## Usage

1. **Migrate D1**

```
wrangler d1 migrations apply JOB_SCRAPER_DB --local --file apps/worker/migrations
```

2. **Seed sites**

```
pnpm --filter @job-scraper/scripts node scripts/seed-sites.ts
```

3. **Add search config**

Use the API or dashboard to create a search config with keywords like:
`["legal","matter management","discovery","e-discovery","ai","product lead"]`

4. **Trigger discovery**

```
curl -H "Authorization: Bearer <token>" -X POST http://localhost:8787/api/runs/discovery
```

5. **View results**

Open the dashboard with `pnpm --filter @job-scraper/dashboard dev` and navigate to `/jobs`.

6. **Enable monitoring**

```
curl -H "Authorization: Bearer <token>" -X POST http://localhost:8787/api/runs/monitor
```

7. **Query via agent**

```
curl -H "Authorization: Bearer <token>" "http://localhost:8787/api/agent/query?q=engineer"
```
