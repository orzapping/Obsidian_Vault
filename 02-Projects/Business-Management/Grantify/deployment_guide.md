# MIFIDPRU Web Application Deployment Guide

This guide provides detailed step-by-step instructions for deploying the MIFIDPRU web application.

## Prerequisites

Before you begin, ensure you have the following:

1. **Node.js and npm**: Version 16.x or higher
2. **Cloudflare Account**: Free tier is sufficient
3. **Wrangler CLI**: Cloudflare's command-line tool for Workers

## Installation Steps

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Authenticate with Cloudflare

```bash
wrangler login
```

This will open a browser window to authenticate with your Cloudflare account.

### 3. Clone or Download the Application

If you received the application as a zip file, extract it. Otherwise, navigate to the directory containing the application files.

```bash
cd /path/to/mifidpru-webapp
```

### 4. Install Dependencies

```bash
npm install
```

## Local Development

To run the application locally for testing:

```bash
npm run dev
```

This will start the development server at http://localhost:3000

## Database Setup

### 1. Create D1 Database

```bash
wrangler d1 create mifidpru-db
```

This will output configuration details that you should add to your `wrangler.toml` file.

### 2. Update wrangler.toml

Add the database binding to your `wrangler.toml` file:

```toml
[[d1_databases]]
binding = "DB"
database_name = "mifidpru-db"
database_id = "<your-database-id>"
```

Replace `<your-database-id>` with the ID provided when you created the database.

### 3. Apply Database Migrations

```bash
wrangler d1 migrations apply mifidpru-db --local
```

For production:

```bash
wrangler d1 migrations apply mifidpru-db
```

## Production Deployment

### 1. Build the Application

```bash
npm run build
```

### 2. Deploy to Cloudflare Workers

```bash
wrangler deploy
```

After successful deployment, you'll receive a URL where your application is accessible.

## Troubleshooting

### Common Issues

1. **Build Errors**: If you encounter build errors related to React hooks, ensure all components using hooks have the "use client" directive at the top of the file.

2. **Database Connection Issues**: Verify your database ID in wrangler.toml matches the one provided when you created the database.

3. **Deployment Failures**: Check your Cloudflare account limits and ensure you have the necessary permissions.

### Getting Help

If you encounter issues not covered in this guide, refer to:

- Cloudflare Workers documentation: https://developers.cloudflare.com/workers/
- Next.js documentation: https://nextjs.org/docs
- D1 database documentation: https://developers.cloudflare.com/d1/

## Updating the Application

To update the application after making changes:

1. Make your changes to the code
2. Run `npm run build` to build the application
3. Run `wrangler deploy` to deploy the updated application

For database schema changes, create new migration files in the `migrations/` directory and apply them using the migration commands above.

## Backup and Recovery

Regularly backup your database using:

```bash
wrangler d1 backup mifidpru-db
```

This will create a backup file that you can use to restore your database if needed.

## Security Considerations

- Set up appropriate access controls in your Cloudflare account
- Consider implementing authentication for the application
- Regularly update dependencies to address security vulnerabilities
