# Techmap components for Pipedream

[Pipedream](https://pipedream.com) components for [Techmap](https://jobdatafeeds.com)'s job postings data: about 8 million new postings per month from 185 sources in 250 countries and territories, available through the Techmap Jobs API on RapidAPI.

| Component | Type | Description |
|---|---|---|
| **Search Jobs** | Action | Search job postings by country, title, city, occupation, workplace, company, skills and date |
| **New Jobs** | Source (polling) | Emit an event for each new job posting that matches a search |

The code in `components/techmap/` mirrors the folder in the [Pipedream components repository](https://github.com/PipedreamHQ/pipedream/tree/master/components), where the public version of these components is submitted. See [components/techmap/README.md](components/techmap/README.md) for use cases and setup.

## Requirements

A RapidAPI key subscribed to the [Techmap Jobs API](https://rapidapi.com/techmap-io-techmap-io-default/api/daily-international-job-postings). The free plan includes 1,000 job postings per month.

## Development

Test the components in your own Pipedream account with the [Pipedream CLI](https://pipedream.com/docs/cli/):

```bash
pd dev components/techmap/sources/new-jobs/new-jobs.mjs
pd publish components/techmap/actions/search-jobs/search-jobs.mjs
```

## Related

- [MCP server](https://github.com/TechMap/mcp.techmap.io) for AI assistants
- [n8n community node](https://github.com/TechMap/n8n.techmap.io)

## License

MIT
