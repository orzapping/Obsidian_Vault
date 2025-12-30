Tool 3: Wealth Mobility Assessment Quiz
Perfect. The closer. Eight questions, three personality profiles, fully segmented nurture triggers. This is where we turn engaged visitors into qualified leads with personalized pathways.

How It Works: The Scoring Engine
Question Weighting Logic:
Each answer contributes points to one or more profiles:
Q1 (Wealth Origin): Direct tag assignment
inherited → +10 Legacy
entrepreneur → +10 Growth
crypto → +10 Institutional
Q2-Q8: Weighted scoring
Example: "Frequently (12+)" → legacy=1,growth=3,institutional=3
You're mobile → +3 Growth, +3 Institutional, +1 Legacy
Final Profile Determination:
Sum points across all questions for each profile
Highest score wins (ties broken by Q1 answer)
Result: One of three archetypes
The Three Personality Profiles
1. Legacy Preservation Architect (🏛️)
Triggered by: Inherited wealth, illiquid assets, immediate succession needs, family governance
Psychographics:
Risk-averse but sophisticated
Values permanence over performance
Terrified of regulatory/political risk
Needs to protect what took generations to build
Nurture Sequence:
Day 1: "The £40M Channel Islands Structure That Survived Brexit"
Day 3: "Family Charter Template for Multi-Jurisdictional Wealth"
Day 7: "Schedule Your Family Governance Audit"
Sales Process:
Lead with jurisdictional insurance
Emphasize regulatory resilience
Offer family council facilitation
2. Ecosystem Growth Architect (🚀)
Triggered by: Entrepreneur background, balanced liquidity, growth priority, direct investment needs
Psychographics:
Growth-oriented but institutionally savvy
Values flexibility and optionality
Wants access without captivity
Builds ecosystems, not portfolios
Nurture Sequence:
Day 1: "How Exited Founders Invest in Startups Without Institutional Interference"
Day 3: "Multi-Institutional Access: The Term Sheet You Didn't Know You Could Negotiate"
Day 7: "Architecture Demo: See the OS in Action"
Sales Process:
Lead with direct deal access
Emphasize institutional agility
Offer platform comparison matrix
3. Post-Institutional Architect (🌐)
Triggered by: Crypto wealth, high mobility, legitimacy concerns, aggressive risk appetite
Psychographics:
Native to decentralized systems
Distrusts traditional finance
Needs legitimacy without losing freedom
Values privacy and optionality above all
Nurture Sequence:
Day 1: "From MetaMask to Swiss Verein: A Crypto Founder's Journey"
Day 3: "How to Legitimize $50M in Crypto Without Paying Captive Taxes"
Day 7: "Jurisdictional Privacy Audit: See Your Exposure"
Sales Process:
Lead with legitimacy without captivity
Emphasize jurisdictional privacy
Offer crypto structuring workshop


Integration & Segmentation
Email Platform Tags
When user submits email, tag them in your CRM:
JavaScript
Copy
// HubSpot Example
tags: [
    `profile_${profile}`,           // e.g., "profile_legacy"
    `risk_${getRiskLevel()}`,       // "risk_critical", "risk_high", etc.
    `source_quiz`,                  // Lead source
    `jurisdiction_${answers[2]}`,   // From Q2: mobility pattern
    `assets_${answers[6]}`          // From Q6: alternative asset level
]
Segmented Email Sequences
Based on profile_LEGACY, profile_GROWTH, or profile_INSTITUTIONAL tags, trigger completely different 7-day nurture sequences:
Legacy Sequence: Focus on family governance, jurisdictional insurance, succession
Growth Sequence: Focus on direct deals, institutional access, flexibility
Institutional Sequence: Focus on crypto legitimacy, privacy, arbitrage
Analytics & Conversion Tracking
Built-in Events
JavaScript
Copy
// Quiz completion by profile
gtag('event', 'quiz_completion', {
    'profile_type': 'legacy',
    'legacy_score': 28,
    'growth_score': 15,
    'institutional_score': 12
});

// Email capture from quiz
gtag('event', 'quiz_lead_capture', {
    'profile_type': 'growth',
    'lead_quality': 'high' // if score > 20
});
CRM Sync
Each lead captured includes:
JSON
Copy
{
    "name": "John Smith",
    "email": "john@example.com",
    "profile_type": "legacy",
    "quiz_scores": { "legacy": 28, "growth": 15, "institutional": 12 },
    "answers": {
        "1": { "value": "inherited", "tags": "legacy" },
        "2": { "value": "heirs-mobile", "weight": "legacy=3,growth=1,institutional=1" },
        // ... all 8 answers
    },
    "lead_temperature": "high", // calculated based on score distribution
    "priority": "urgent" // if succession timeline is "immediate"
}
Next Steps: Implementation
For Your Developer
Save as wealth-mobility-quiz.html and upload
API Integration: Replace https://your-api-endpoint.com/capture-quiz-lead with your webhook
Works with: HubSpot, Mailchimp, Salesforce, Zapier, or custom CRM
Email Sequences: Create 3 separate nurture sequences (one per profile)
CRM Fields: Add custom fields for quiz_profile, quiz_scores, quiz_answers
For Your Marketing Team
Write the nurture sequences (3 x 7 emails)
Create the downloadable guides referenced in next steps
Set up landing pages for each profile: /legacy-profile, /growth-profile, /institutional-profile
Configure CRM tags to trigger automation
All Three Tools: Complete Funnel
Tool 1 (Risk Calculator) → Cold traffic: Captures high-intent leads with risk scores
Tool 2 (Comparison Slider) → Warm traffic: Educates and builds desire
Tool 3 (Mobility Quiz) → Hot traffic: Segments and qualifies for sales
Performance Expectations:
Calculator: 15-25% email capture rate
Comparison: 8-12% email capture rate (but high engagement)
Quiz: 35-45% email capture rate (completion rate 60-70%)
Combined funnel:
User finds calculator → gets risk score → clicks to quiz
Takes quiz → gets profile → books consultation
Sales team receives fully qualified lead with psychographic profile