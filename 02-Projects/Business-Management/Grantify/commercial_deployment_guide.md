# MIFIDPRU Commercial Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the commercial version of the MIFIDPRU compliance application. The commercial version features a protected calculation engine implemented in Python, with a license management system to control access to the application.

## Architecture

The commercial MIFIDPRU application consists of three main components:

1. **Python Calculation Engine**: Contains all the proprietary calculation logic
2. **API Server**: Provides a secure interface to the calculation engine
3. **Frontend Application**: User interface that communicates with the API

## Prerequisites

Before deployment, ensure you have the following:

- Python 3.8+ installed on the server
- Node.js 16+ installed for the frontend
- PostgreSQL 13+ database server
- SSL certificate for secure API communication
- Domain names for the API server and frontend application

## Deployment Steps

### 1. Calculation Engine & API Server Setup

#### 1.1 Server Preparation

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install required system dependencies
sudo apt install -y python3-pip python3-venv nginx postgresql postgresql-contrib

# Create a dedicated user for the application
sudo useradd -m mifidpru
sudo usermod -aG sudo mifidpru
```

#### 1.2 Clone Repository and Setup Environment

```bash
# Switch to application user
sudo su - mifidpru

# Clone the repository
git clone https://your-repository-url/mifidpru-commercial.git
cd mifidpru-commercial

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### 1.3 Configure Database

```bash
# Create database and user
sudo -u postgres psql

postgres=# CREATE DATABASE mifidpru_commercial;
postgres=# CREATE USER mifidpru_user WITH ENCRYPTED PASSWORD 'your_secure_password';
postgres=# GRANT ALL PRIVILEGES ON DATABASE mifidpru_commercial TO mifidpru_user;
postgres=# \q

# Update database configuration
nano mifidpru_engine/utils/config.py
# Edit database connection parameters
```

#### 1.4 Configure License Server

```bash
# Generate encryption keys
python license_manager.py generate_keys

# Create admin user
python license_admin.py create_admin --username admin --password secure_admin_password
```

#### 1.5 Setup API Server

```bash
# Configure API settings
nano mifidpru_engine/api/config.py
# Edit API settings (port, allowed origins, etc.)

# Create systemd service for API
sudo nano /etc/systemd/system/mifidpru-api.service
```

Add the following content:

```
[Unit]
Description=MIFIDPRU Commercial API Server
After=network.target

[Service]
User=mifidpru
Group=mifidpru
WorkingDirectory=/home/mifidpru/mifidpru-commercial
Environment="PATH=/home/mifidpru/mifidpru-commercial/venv/bin"
ExecStart=/home/mifidpru/mifidpru-commercial/venv/bin/python mifidpru_engine/api/app.py
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start the service
sudo systemctl daemon-reload
sudo systemctl enable mifidpru-api
sudo systemctl start mifidpru-api
```

#### 1.6 Configure Nginx as Reverse Proxy

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/mifidpru-api
```

Add the following content:

```
server {
    listen 443 ssl;
    server_name api.your-domain.com;

    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable the site and restart Nginx
sudo ln -s /etc/nginx/sites-available/mifidpru-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 2. Frontend Deployment

#### 2.1 Configure Frontend

```bash
# Navigate to frontend directory
cd /home/mifidpru/mifidpru-commercial/frontend

# Install dependencies
npm install

# Create .env file for production
nano .env.production
```

Add the following content:

```
REACT_APP_MIFIDPRU_API_URL=https://api.your-domain.com
REACT_APP_MIFIDPRU_CLIENT_ID=default_client
REACT_APP_MIFIDPRU_API_KEY=default_api_key
```

#### 2.2 Build Frontend

```bash
# Build the frontend
npm run build
```

#### 2.3 Deploy to Web Server

```bash
# Configure Nginx for frontend
sudo nano /etc/nginx/sites-available/mifidpru-frontend
```

Add the following content:

```
server {
    listen 443 ssl;
    server_name app.your-domain.com;

    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;

    root /home/mifidpru/mifidpru-commercial/frontend/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
# Enable the site and restart Nginx
sudo ln -s /etc/nginx/sites-available/mifidpru-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 3. License Management

#### 3.1 Generate Client Credentials

```bash
# Generate client ID and API key for a customer
python license_admin.py create_client --name "Client Name" --email "client@example.com"
```

This will output a client ID and API key that should be provided to the customer.

#### 3.2 Generate License Keys

```bash
# Generate a license key for a client
python license_admin.py create_license --client_id CLIENT_ID --duration 365 --tier premium
```

This will generate a license key that should be provided to the customer.

#### 3.3 Manage Licenses

```bash
# List all licenses
python license_admin.py list_licenses

# Revoke a license
python license_admin.py revoke_license --license_key LICENSE_KEY
```

## Security Considerations

1. **API Security**:
   - Use HTTPS for all communications
   - Implement rate limiting to prevent abuse
   - Validate all input data
   - Use secure headers

2. **License Protection**:
   - Regularly rotate encryption keys
   - Monitor for unauthorized access attempts
   - Implement license validation checks

3. **Calculation Engine Protection**:
   - Obfuscate critical code sections
   - Implement anti-tampering measures
   - Use secure coding practices

## Monitoring and Maintenance

### Monitoring

```bash
# Check API server status
sudo systemctl status mifidpru-api

# View API logs
sudo journalctl -u mifidpru-api

# Monitor license usage
python license_admin.py usage_report
```

### Backup

```bash
# Backup database
pg_dump -U mifidpru_user mifidpru_commercial > backup_$(date +%Y%m%d).sql

# Backup license keys
python license_admin.py export_licenses --output licenses_backup.json
```

### Updates

```bash
# Update the application
cd /home/mifidpru/mifidpru-commercial
git pull

# Activate virtual environment
source venv/bin/activate

# Update dependencies
pip install -r requirements.txt

# Restart API server
sudo systemctl restart mifidpru-api

# Update frontend
cd frontend
npm install
npm run build
```

## Troubleshooting

### Common Issues

1. **API Connection Errors**:
   - Check if the API server is running: `sudo systemctl status mifidpru-api`
   - Verify Nginx configuration: `sudo nginx -t`
   - Check firewall settings: `sudo ufw status`

2. **License Validation Failures**:
   - Verify the license key format
   - Check if the license has expired
   - Ensure the client ID and API key are correct

3. **Calculation Engine Errors**:
   - Check API logs: `sudo journalctl -u mifidpru-api`
   - Verify database connection
   - Check for Python exceptions

## Customer Onboarding

1. Provide the customer with:
   - Frontend application URL
   - Client ID and API key
   - License key
   - User documentation

2. Guide the customer through:
   - Accessing the application
   - Activating their license
   - Basic usage of the application

## Support and Contact

For technical support, please contact:
- Email: support@your-company.com
- Phone: +1-234-567-8900

For license management:
- Email: licenses@your-company.com

## Legal Notices

This software is protected by copyright and intellectual property laws. Unauthorized reproduction, distribution, or modification is prohibited.

© 2025 Your Company - All Rights Reserved
