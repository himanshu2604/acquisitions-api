import 'dotenv/config';

import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
const databaseUrl = process.env.DATABASE_URL;
const parsedDatabaseUrl = databaseUrl ? new URL(databaseUrl) : null;
const localDatabaseHosts = new Set(['neon-local', 'localhost', '127.0.0.1']);

if (parsedDatabaseUrl && localDatabaseHosts.has(parsedDatabaseUrl.hostname)) {
  const databasePort = parsedDatabaseUrl.port || '5432';
  neonConfig.fetchEndpoint = `http://${parsedDatabaseUrl.hostname}:${databasePort}/sql`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}
const sql = neon(databaseUrl);

const db = drizzle(sql);

export { db, sql };
