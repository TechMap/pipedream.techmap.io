import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../techmap.app.mjs";
import sampleEmit from "./test-event.mjs";

const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_REMEMBERED_IDS = 5000;

export default {
  key: "techmap-new-jobs",
  name: "New Jobs",
  description: "Emit new event for each new job posting that matches your search. Each poll requests up to **Max Pages** × 10 postings, which count towards your monthly quota. [See the documentation](https://api.techmap.io)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
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
    excludeDuplicates: {
      propDefinition: [
        app,
        "excludeDuplicates",
      ],
    },
    lookbackDays: {
      type: "integer",
      label: "Lookback Days",
      description: "How many days back from today to search by date created. Postings are indexed with a short delay, so `1` or `2` avoids missing jobs.",
      min: 0,
      max: 14,
      default: 2,
      optional: true,
    },
    maxPages: {
      type: "integer",
      label: "Max Pages",
      description: "Maximum number of result pages (10 postings each) to request per poll",
      min: 1,
      max: 20,
      default: 1,
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      // Emit up to 10 recent postings as sample events and remember them.
      await this.processJobs({
        maxPages: 1,
      });
    },
  },
  methods: {
    _getSeenIds() {
      return this.db.get("seenIds") ?? [];
    },
    _setSeenIds(ids) {
      this.db.set("seenIds", ids.slice(-MAX_REMEMBERED_IDS));
    },
    _toIsoDate(date) {
      return date.toISOString().slice(0, 10);
    },
    getParams() {
      const now = new Date();
      const lookbackDays = this.lookbackDays ?? 2;
      return this.app.buildSearchParams({
        countryCode: this.countryCode,
        title: this.title,
        city: this.city,
        occupation: this.occupation,
        workPlace: this.workPlace,
        excludeDuplicates: this.excludeDuplicates,
        dateCreatedMin: this._toIsoDate(new Date(now.getTime() - lookbackDays * DAY_MS)),
        dateCreatedMax: this._toIsoDate(now),
        // Newest first, so the first pages always contain the latest postings
        sort: "newest",
      });
    },
    generateMeta(job) {
      const id = this.app.getJobId(job);
      const ts = Date.parse(job.dateCreated) || Date.now();
      const where = [
        job.city,
        job.countryCode?.toUpperCase(),
      ].filter(Boolean).join(", ");
      return {
        id,
        summary: `New job: ${job.title}${job.company
          ? ` at ${job.company}`
          : ""}${where
          ? ` (${where})`
          : ""}`,
        ts,
      };
    },
    async processJobs({ maxPages }) {
      const seen = new Set(this._getSeenIds());
      const newJobs = [];
      const jobs = this.app.paginateJobs({
        params: this.getParams(),
        maxPages,
      });
      for await (const job of jobs) {
        const id = this.app.getJobId(job);
        if (!id || seen.has(id)) continue;
        seen.add(id);
        newJobs.push(job);
      }
      for (const job of newJobs.reverse()) {
        this.$emit(job, this.generateMeta(job));
      }
      this._setSeenIds([
        ...seen,
      ]);
    },
  },
  async run() {
    await this.processJobs({
      maxPages: this.maxPages ?? 1,
    });
  },
  sampleEmit,
};
