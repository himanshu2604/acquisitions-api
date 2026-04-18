import {
  Registry,
  collectDefaultMetrics,
  Counter,
  Histogram,
} from 'prom-client';

export const register = new Registry();
register.setDefaultLabels({ app: 'acquisitions-api' });

// Automatically collects Node.js internals:
// heap size, GC duration, event loop lag, active handles, etc.
collectDefaultMetrics({ register });

// Custom metric 1: count every HTTP request
export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests received',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

// Custom metric 2: measure how long each request takes
export const httpDurationSeconds = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});
