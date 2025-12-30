# GitHub/Netlify Deployment Guide for MIFIDPRU Web Application

This guide provides detailed instructions for deploying the MIFIDPRU web application on GitHub and Netlify with PostgreSQL database integration.

## Prerequisites

Before you begin, ensure you have the following:

1. **GitHub Account**: For source code hosting
2. **Netlify Account**: For application deployment
3. **PostgreSQL Database**: Either:
   - Supabase account (recommended)
   - Heroku Postgres
   - Any PostgreSQL hosting service

## Setting Up the Database

### Option 1: Supabase (Recommended)

1. **Create a Supabase Project**:
   - Sign up at [supabase.com](https://supabase.com)
   - Create a new project
   - Note your database URL and credentials

2. **Initialize the Database**:
   - Go to the SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `/migrations/postgresql/init.sql`
   - Run the SQL script to create all tables and initial data

### Option 2: Heroku Postgres

1. **Create a Heroku Account**:
   - Sign up at [heroku.com](https://heroku.com)

2. **Create a Postgres Database**:
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

3. **Get Database Credentials**:
   ```bash
   heroku pg:credentials:url
   ```

4. **Initialize the Database**:
   - Use a PostgreSQL client (like pgAdmin or psql) to connect to your database
   - Run the SQL script from `/migrations/postgresql/init.sql`

## GitHub Repository Setup

1. **Create a New Repository**:
   - Go to GitHub and create a new repository
   - Initialize with a README if desired

2. **Push the Application Code**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/mifidpru-webapp.git
   git push -u origin main
   ```

3. **Configure Environment Variables**:
   - Create a `.env.local` file (for local development)
   - Add your database connection string:
   ```
   DATABASE_URL=postgresql://username:password@host:port/database
   ```
   - Add this file to `.gitignore` to prevent committing sensitive information

## Configuring the Application for PostgreSQL

1. **Update Database Configuration**:
   - Create a file called `src/lib/db.js` with the following content:

   ```javascript
   import { getDb as getPostgresDb } from './postgres-db';

   // Use PostgreSQL database
   export const getDb = getPostgresDb;
   ```

2. **Update API Routes**:
   - Create a file called `src/app/api/route-config.js` with the following content:

   ```javascript
   // Set this to true to use PostgreSQL, false to use Cloudflare D1
   export const usePostgres = true;

   // Helper function to get the correct API path
   export const getApiPath = (endpoint) => {
     return usePostgres ? `/api/postgres/${endpoint}` : `/api/${endpoint}`;
   };
   ```

3. **Update Frontend Components**:
   - Modify API fetch calls in components to use the route-config:

   ```javascript
   import { getApiPath } from '../../app/api/route-config';

   // Then use it in fetch calls
   fetch(getApiPath('firm-details'))
   ```

## Netlify Deployment

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Create a `netlify.toml` File**:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [build.environment]
     NEXT_PUBLIC_USE_POSTGRES = "true"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

4. **Create a Netlify Site**:
   ```bash
   netlify sites:create --name mifidpru-webapp
   ```

5. **Set Environment Variables**:
   ```bash
   netlify env:set DATABASE_URL "postgresql://username:password@host:port/database"
   ```

6. **Deploy the Application**:
   ```bash
   netlify deploy --prod
   ```

## GitHub Actions for Continuous Deployment

1. **Create a GitHub Actions Workflow File**:
   - Create a directory: `.github/workflows`
   - Create a file: `.github/workflows/netlify-deploy.yml`

   ```yaml
   name: Deploy to Netlify

   on:
     push:
       branches: [ main ]

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         
         - name: Setup Node.js
           uses: actions/setup-node@v2
           with:
             node-version: '16'
             
         - name: Install dependencies
           run: npm ci
           
         - name: Build
           run: npm run build
           
         - name: Deploy to Netlify
           uses: netlify/actions/cli@master
           env:
             NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
             NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
           with:
             args: deploy --prod
   ```

2. **Set Up GitHub Secrets**:
   - Go to your GitHub repository settings
   - Navigate to Secrets > Actions
   - Add the following secrets:
     - `NETLIFY_AUTH_TOKEN`: Your Netlify personal access token
     - `NETLIFY_SITE_ID`: Your Netlify site ID

## Testing the Deployment

1. **Local Testing**:
   ```bash
   npm run dev
   ```

2. **Preview Deployment**:
   ```bash
   netlify deploy
   ```

3. **Production Deployment**:
   ```bash
   netlify deploy --prod
   ```

## Troubleshooting

### Database Connection Issues

1. **Check Connection String**:
   - Verify your DATABASE_URL is correctly formatted
   - Ensure the database user has appropriate permissions

2. **Network Issues**:
   - Check if your database allows connections from Netlify's IP ranges
   - Consider using connection pooling for better performance

3. **SSL Requirements**:
   - Some PostgreSQL providers require SSL connections
   - Update the connection options in `postgres-db.js` if needed:
   ```javascript
   ssl: { rejectUnauthorized: false }
   ```

### Netlify Build Failures

1. **Check Build Logs**:
   - Review the build logs in the Netlify dashboard
   - Look for specific error messages

2. **Environment Variables**:
   - Verify all required environment variables are set
   - Check for typos in variable names

3. **Dependencies**:
   - Ensure all dependencies are correctly listed in package.json
   - Try clearing the Netlify cache and rebuilding

## Maintenance and Updates

### Updating the Application

1. **Make Changes Locally**:
   - Develop and test changes in your local environment

2. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Update description"
   git push origin main
   ```

3. **Automatic Deployment**:
   - If GitHub Actions is configured, changes will automatically deploy
   - Otherwise, manually deploy using `netlify deploy --prod`

### Database Migrations

For future database schema changes:

1. **Create Migration Files**:
   - Add new SQL files in the `/migrations/postgresql/` directory
   - Name them sequentially (e.g., `002_add_new_table.sql`)

2. **Apply Migrations**:
   - Run the SQL scripts against your PostgreSQL database
   - Consider using a migration tool like `node-pg-migrate` for more complex projects

## Switching Between Database Solutions

The application is designed to work with both Cloudflare D1 and PostgreSQL. To switch:

1. **For PostgreSQL (GitHub/Netlify)**:
   - Set `usePostgres = true` in `src/app/api/route-config.js`
   - Ensure your PostgreSQL database is properly configured

2. **For Cloudflare D1**:
   - Set `usePostgres = false` in `src/app/api/route-config.js`
   - Follow the Cloudflare deployment guide
