import { axios } from "@pipedream/platform";
import {
  JOBS_API_HOST,
  JOBS_BASE_URL,
  PAGE_SIZE,
  WORK_PLACE_OPTIONS,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "techmap",
  propDefinitions: {
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "Two-letter ISO 3166-1 alpha-2 country code of the job location, e.g. `us`, `de` or `gb`",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Free-text search within the job title, e.g. `data engineer`",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City of the workplace, e.g. `Berlin`",
      optional: true,
    },
    occupation: {
      type: "string",
      label: "Occupation",
      description: "Occupation stem extracted from the job title, e.g. `programmer`, `manager`, `engineer` or `nurse`",
      optional: true,
    },
    workPlace: {
      type: "string",
      label: "Work Place",
      description: "Workplace type of the job",
      options: WORK_PLACE_OPTIONS,
      optional: true,
    },
    dateCreated: {
      type: "string",
      label: "Date Created",
      description: "Day (`YYYY-MM-DD`) or month (`YYYY-MM`) the job was posted. If empty, the API uses the current day minus two days.",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "Company that posted the job (can be a recruiting firm)",
      optional: true,
    },
    skills: {
      type: "string",
      label: "Skills",
      description: "Skills, keywords or tags associated with the job posting, e.g. `python`",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Two-letter ISO 639-1 language code of the job posting, e.g. `en`",
      optional: true,
    },
    excludeDuplicates: {
      type: "boolean",
      label: "Exclude Duplicates",
      description: "Exclude job postings that are flagged as duplicates of another posting",
      optional: true,
    },
  },
  methods: {
    _headers(headers = {}) {
      return {
        "X-RapidAPI-Key": this.$auth.api_key,
        "X-RapidAPI-Host": JOBS_API_HOST,
        "Accept": "application/json",
        ...headers,
      };
    },
    /**
     * Sends a request to the Techmap Jobs API on RapidAPI.
     * @param {object} opts
     * @param {object} [opts.$] - The Pipedream step context
     * @param {string} opts.path - API path relative to `/api/v2`
     * @returns {Promise<object>} The parsed JSON response
     */
    _makeRequest({
      $ = this, path, headers, ...opts
    } = {}) {
      return axios($, {
        url: `${JOBS_BASE_URL}${path}`,
        headers: this._headers(headers),
        ...opts,
      });
    },
    /**
     * Builds the query parameters for a job search and drops empty values.
     * @param {object} filters - Values of the search props
     * @returns {object} Query parameters for `/jobs/search`
     */
    buildSearchParams({
      excludeDuplicates, ...filters
    } = {}) {
      const params = {};
      for (const [
        key,
        value,
      ] of Object.entries(filters)) {
        if (value === undefined || value === null) continue;
        if (typeof value === "string" && value.trim() === "") continue;
        params[key] = typeof value === "string"
          ? value.trim()
          : value;
      }
      if (excludeDuplicates) {
        params.isDuplicate = "false";
      }
      return params;
    },
    /**
     * Searches job postings. Each page contains up to 10 postings.
     * @param {object} [args] - Request options, e.g. `{ $, params }`
     * @returns {Promise<object>} Search response with `totalCount` and `result`
     */
    searchJobs(args = {}) {
      return this._makeRequest({
        path: "/jobs/search",
        ...args,
      });
    },
    /**
     * Iterates over the job postings of a search, page by page.
     * @param {object} opts
     * @param {object} [opts.params] - Search parameters
     * @param {number} [opts.maxPages=1] - Maximum number of pages to request
     * @yields {object} A job posting
     */
    async *paginateJobs({
      $, params = {}, maxPages = 1,
    } = {}) {
      for (let page = 1; page <= maxPages; page++) {
        const { result = [] } = await this.searchJobs({
          $,
          params: {
            ...params,
            page,
          },
        });
        for (const job of result) {
          yield job;
        }
        if (result.length < PAGE_SIZE) return;
      }
    },
    /**
     * Returns a stable identifier of a job posting.
     * @param {object} job - A job posting
     * @returns {string|undefined} The JSON-LD identifier or the job URL
     */
    getJobId(job) {
      return job?.jsonLD?.identifier ?? job?.jsonLD?.url;
    },
  },
};
