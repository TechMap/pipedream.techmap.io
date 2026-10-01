import { ConfigurationError } from "@pipedream/platform";
import app from "../../techmap.app.mjs";

export default {
  key: "techmap-search-jobs",
  name: "Search Jobs",
  description: "Search daily international job postings by country, title, city, occupation, workplace and date. Each page returns up to 10 postings, which count towards your monthly quota. [See the documentation](https://api.techmap.io)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    countryCode: {
      propDefinition: [
        app,
        "countryCode",
      ],
    },
    title: {
      propDefinition: [
        app,
        "title",
      ],
    },
    city: {
      propDefinition: [
        app,
        "city",
      ],
    },
    occupation: {
      propDefinition: [
        app,
        "occupation",
      ],
    },
    workPlace: {
      propDefinition: [
        app,
        "workPlace",
      ],
    },
    dateCreated: {
      propDefinition: [
        app,
        "dateCreated",
      ],
    },
    company: {
      propDefinition: [
        app,
        "company",
      ],
    },
    skills: {
      propDefinition: [
        app,
        "skills",
      ],
    },
    language: {
      propDefinition: [
        app,
        "language",
      ],
    },
    excludeDuplicates: {
      propDefinition: [
        app,
        "excludeDuplicates",
      ],
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page of the search results, starting at 1. Each page contains up to 10 job postings.",
      min: 1,
      default: 1,
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.dateCreated && !/^\d{4}-\d{2}(-\d{2})?$/.test(this.dateCreated.trim())) {
      throw new ConfigurationError("**Date Created** must use the format `YYYY-MM-DD` or `YYYY-MM`.");
    }

    const response = await this.app.searchJobs({
      $,
      params: this.app.buildSearchParams({
        countryCode: this.countryCode,
        title: this.title,
        city: this.city,
        occupation: this.occupation,
        workPlace: this.workPlace,
        dateCreated: this.dateCreated,
        company: this.company,
        skills: this.skills,
        language: this.language,
        excludeDuplicates: this.excludeDuplicates,
        page: this.page,
      }),
    });

    const jobs = response?.result ?? [];
    $.export("$summary", `Found ${jobs.length} job posting${jobs.length === 1
      ? ""
      : "s"} on page ${response?.page ?? this.page ?? 1} (${response?.totalCount ?? 0} matches in total)`);
    return response;
  },
};
