# ToDo app for LeetCode

## Configure and run

1. Set `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET`, could be found on [GitHub](https://github.com/settings/applications/2853004)

1. Set `DATABASE_URL` in format `mysql://USER:PASSWORD@HOST:PORT/DATABASE`

1. Set `EDGE_CONFIG`, `VERCEL_API_TOKEN`, and `EDGE_CONFIG_ID` found on Vercel

1. For development only, set `CRON_SECRET` with random string

## Useful CLI commands

```sh
# Add migration
npx prisma migrate dev --name {migration name here}
npx prisma generate

# Update DB schema without adding migrations
npx prisma db push

# Reset migrations and schema
rm -rf prisma/migrations
npx prisma db push --force-reset && npx prisma db push
```
