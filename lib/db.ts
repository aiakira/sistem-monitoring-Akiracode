import { Pool } from 'pg';
import { neon } from '@neondatabase/serverless'; 

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set.');
}

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

const sql = neon(connectionString);

export { pool, sql };
