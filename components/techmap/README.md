# Overview

[Techmap](https://jobdatafeeds.com) collects about 8 million new job postings per month from 185 sources (company career pages and ATS platforms, job boards, aggregators and public employment offices) in 250 countries and territories. The Techmap Jobs API, available on RapidAPI, lets you search these postings by country, title, city, occupation, workplace type, company, skills and date. Each posting includes the title, company, location, workplace type and a schema.org JobPosting record with the full description and the link to the original ad.

# Example Use Cases

- **Job alerts**: Use the **New Jobs** source to post new remote data engineering jobs in Germany to Slack or Microsoft Teams.
- **Lead generation**: Search for companies that are hiring for specific roles and add them to your CRM.
- **Job board backfill**: Fill your own job board or newsletter with fresh postings for selected countries and occupations.
- **Labor market research**: Collect postings into Google Sheets, Airtable or a database to analyze demand by city, skill or workplace type.

# Getting Started

1. Create a free account on [RapidAPI](https://rapidapi.com).
2. Subscribe to the [Techmap Daily International Job Postings API](https://rapidapi.com/techmap-io-techmap-io-default/api/daily-international-job-postings). The free plan includes 1,000 job postings per month.
3. Copy your application key (`X-RapidAPI-Key`) from the RapidAPI dashboard.
4. In Pipedream, connect the Techmap app and paste the key.
5. Add the **Search Jobs** action or the **New Jobs** source to a workflow.

# Troubleshooting

- **401 or 403 errors**: Check that the key is correct and that it is subscribed to the Techmap Jobs API on RapidAPI.
- **429 errors or empty results at the end of the month**: Your monthly quota is used up. Each page returns up to 10 postings and every returned posting counts towards the quota. Poll less often, lower **Max Pages** or upgrade your plan.
- **No results for today**: Postings are indexed with a short delay. Search the previous days, or keep **Lookback Days** at `1` or `2` in the **New Jobs** source.
- **Country codes**: Use two-letter ISO 3166-1 codes such as `us`, `de` or `gb`.

See the [Techmap API documentation](https://api.techmap.io) for all parameters and the response format.
