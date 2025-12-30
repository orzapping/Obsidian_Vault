"""
MIFIDPRU Commercial - License Management User Guide
This document provides instructions for managing licenses in the commercial version.
Copyright (c) 2025 - All Rights Reserved
"""

# MIFIDPRU Commercial License Management Guide

## Overview

This guide explains how to use the license management system for the MIFIDPRU commercial application. The license management system allows you to create, distribute, and manage licenses for your customers.

## License System Architecture

The license management system consists of:

1. **License Manager**: Command-line tool for generating and managing license keys
2. **License Admin**: Web interface for managing clients and licenses
3. **License Validator**: Component that validates licenses in the API server
4. **License Activation**: Frontend component for customers to activate their licenses

## License Types and Tiers

The system supports the following license tiers:

| Tier | Features | Duration Options |
|------|----------|------------------|
| Basic | Core MIFIDPRU compliance features | 30, 90, 365 days |
| Professional | + Advanced stress testing, historical data | 90, 365 days |
| Enterprise | + Custom reporting, API access | 365 days, perpetual |

## Command-Line License Management

### Prerequisites

- Python 3.8+
- Access to the license management server

### Basic Commands

#### Generate Encryption Keys

```bash
python license_manager.py generate_keys
```

This creates the encryption keys needed for secure license generation.

#### Create a Client

```bash
python license_admin.py create_client --name "Client Company Name" --email "contact@client.com"
```

This generates a client ID and API key for the customer.

#### Create a License

```bash
python license_admin.py create_license --client_id CLIENT_ID --duration 365 --tier professional
```

This generates a license key that can be provided to the customer.

#### List All Licenses

```bash
python license_admin.py list_licenses
```

Shows all active and expired licenses.

#### Revoke a License

```bash
python license_admin.py revoke_license --license_key LICENSE_KEY
```

Immediately invalidates the specified license key.

## Web Admin Interface

The license management system includes a web-based admin interface for easier management.

### Accessing the Admin Interface

1. Navigate to `https://your-license-server.com/admin`
2. Log in with your administrator credentials

### Managing Clients

1. Click on "Clients" in the navigation menu
2. To add a new client, click "Add Client" and fill in the details
3. To view or edit a client, click on their name in the list
4. To generate API credentials, click "Generate Credentials" on the client details page

### Managing Licenses

1. Click on "Licenses" in the navigation menu
2. To create a new license, click "Create License" and select the client, tier, and duration
3. To revoke a license, find it in the list and click "Revoke"
4. To view license details and usage, click on the license ID

### Usage Reports

1. Click on "Reports" in the navigation menu
2. Select the date range and report type
3. Click "Generate Report"
4. Reports can be exported as CSV or PDF

## Customer License Activation

Provide these instructions to your customers:

1. Access the MIFIDPRU application at your provided URL
2. You will see a license activation screen
3. Enter the license key provided to you
4. Click "Activate License"
5. Once activated, the license will be remembered on that device

## License Validation Process

The license validation process works as follows:

1. Customer enters license key in the frontend
2. Frontend sends the key to the API server
3. API server validates the license using the license validator
4. If valid, the API server enables access to the calculation engine
5. The license is periodically revalidated to ensure it hasn't been revoked

## Security Best Practices

1. **Key Management**:
   - Store encryption keys securely
   - Rotate keys periodically (at least annually)
   - Backup keys in a secure location

2. **License Distribution**:
   - Send license keys through secure channels
   - Consider using a customer portal for license delivery
   - Include usage terms with each license

3. **Monitoring**:
   - Monitor for unusual license validation patterns
   - Set up alerts for multiple activation attempts
   - Regularly audit license usage

## Troubleshooting

### Common Issues

1. **Invalid License Format**:
   - Ensure the license key hasn't been truncated or modified
   - Check for extra spaces or line breaks

2. **Expired License**:
   - Verify the license expiration date
   - Generate a new license if needed

3. **Revoked License**:
   - Check if the license has been revoked in the admin interface
   - Generate a new license if needed

4. **Connection Issues**:
   - Ensure the license server is accessible
   - Check network connectivity

## License Renewal Process

1. Generate a new license key for the client
2. Provide the new key to the client
3. The client can enter the new key before the old one expires
4. The system will automatically update the expiration date

## Customizing License Terms

To customize license terms:

1. Edit the license template in `license_manager.py`
2. Update the validation logic in `validator.py` if needed
3. Restart the license server to apply changes

## Legal Considerations

- Include appropriate legal terms in your license agreement
- Consider consulting with legal counsel for specific requirements
- Ensure compliance with relevant regulations

## Support

For assistance with license management:
- Email: licenses@your-company.com
- Phone: +1-234-567-8900
