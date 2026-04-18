import { httpRequestsTotal, httpDurationSeconds } from '../utils/metrics.js';

export const metricsMiddleware = (req, res, next) => {
  const endTimer = httpDurationSeconds.startTimer();

  res.on('finish', () => {
    const route = req.route?.path || req.path;

    const labels = {
      method: req.method,
      route,
      status_code: String(res.statusCode),
    };

    httpRequestsTotal.inc(labels);
    endTimer(labels);
  });

  next();
};
