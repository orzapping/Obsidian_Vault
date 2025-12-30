Jurisdictional Concentration Risk Calculator: Build Guide

Right, let's build these properly—starting with the most powerful lead-gen tool. First one's ready for your developer, fully functional, modern design, GDPR-compliant data capture.
Tool 1: Jurisdictional Concentration Risk Calculator
What It Does
Scores jurisdictional risk (0-100)
Identifies specific vulnerabilities
Generates personalized recommendations
Captures high-intent leads (email + risk score)
Automatically triggers segmented email nurture


Implementation Instructions
For Your Developer
Drop into any page: Save as risk-calculator.html and upload to root directory
Integrate into existing site:
Copy the <style> block into your main CSS file
Copy the HTML into a page template
Copy the JavaScript into a .js file or <script> tag at bottom of page
API Integration (lines 620-640):
Replace https://your-api-endpoint.com/capture-lead with your actual endpoint
Works with:
HubSpot Forms API
Mailchimp API
Custom CRM webhook
Zapier webhook
Analytics Tracking (lines 636-639):
Google Analytics 4 event tracking included
Adjust for your analytics platform
Email Nurture Trigger:
Pass riskScore to your email platform to trigger segmented sequence
Example: Score >70 → "Critical Risk" sequence
Score 50-70 → "High Risk" sequence
Score <50 → "Optimization" sequence
Scoring Algorithm Explained
Table
Copy
Factor	Weight	Scoring Logic
Jurisdiction	40 pts	UK-only: 40pts, UK+Channel: 25pts, UK+Swiss: 15pts, Multi: 5pts
Institution %	35 pts	>75%: 35pts, >50%: 20pts, >25%: 10pts, <25%: 0pts
Liquidity %	25 pts	>70% illiquid: 25pts, >50%: 15pts, >30%: 5pts
Compound Risk	+10 pts	UK-only AND >50% institution concentration
Risk Categories:
0-30: Low Risk (green)
31-50: Moderate Risk (yellow)
51-70: High Risk (orange)
71-100: Critical Risk (red)


Email Capture Integration Examples
HubSpot (replace lines 620-640)
JavaScript
Copy
// Create new contact + custom properties
fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_HUBSPOT_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    properties: {
      email: email,
      firstname: name.split(' ')[0],
      lastname: name.split(' ')[1] || '',
      risk_score: calculatorState.riskScore,
      jurisdiction_type: calculatorState.jurisdiction,
      institution_concentration: calculatorState.institutionPercentage,
      liquidity_profile: calculatorState.liquidityPercentage
    }
  })
})
Mailchimp (replace lines 620-640)
JavaScript
Copy
// Add to audience with tags
fetch('https://usX.api.mailchimp.com/3.0/lists/YOUR_LIST_ID/members', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_MAILCHIMP_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email_address: email,
    status: 'subscribed',
    merge_fields: {
      FNAME: name.split(' ')[0],
      LNAME: name.split(' ')[1] || '',
      RISK_SCOR: calculatorState.riskScore
    },
    tags: [`jurisdiction_${calculatorState.jurisdiction}`, `risk_${getRiskLevel()}`]
  })
})
Zapier Webhook (easiest, no-code)
JavaScript
Copy
// Just change the URL to your Zapier webhook
fetch('https://hooks.zapier.com/hooks/catch/YOUR_ZAPIER_ID/', {
  method: 'POST',
  body: JSON.stringify(submissionData)
})