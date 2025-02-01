# ToDo app for LeetCode

## Configure and run

1. Add `AUTH_SECRET`

- `npx auth secret` - could be generated via cli

1. Set `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET`

- They could be found on [GitHub](https://github.com/settings/applications/2853004)

1. Set `DATABASE_URL` in format `mysql://USER:PASSWORD@HOST:PORT/DATABASE`

## Database Schema Migration

If you've made changes to the Prisma schema (`schema.prisma`) and need to update the database, follow these steps:

### 1. Generate a New Migration

Use the following command to create a new migration file and apply it to your development database. Replace `add-layout-column` with a descriptive name for your migration.

```sh
npx prisma migrate dev --name {migration name here}
```

### 2. Generate Prisma Client

After applying the migration, regenerate the Prisma Client to reflect the latest schema changes.

```sh
npx prisma generate
```
