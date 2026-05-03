import mysql from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';

let DB_TYPE = process.env.DB_TYPE || 'sqlite';

if (process.env.DATABASE_URL?.startsWith('mysql://')) {
  DB_TYPE = 'mysql';
}

interface DBInterface {
  query(sql: string, params?: any[]): Promise<any>;
  get(sql: string, params?: any[]): Promise<any>;
  all(sql: string, params?: any[]): Promise<any[]>;
  exec(sql: string): Promise<void>;
  transaction(callback: () => Promise<void>): Promise<void>;
}

// Minimal mock for local dev without MySQL, to avoid build errors
class MockSQLiteDB implements DBInterface {
  async query(sql: string, params: any[] = []): Promise<any> { return { results: [] }; }
  async get(sql: string, params: any[] = []): Promise<any> { return { count: 1 }; } // Return count 1 to skip seed
  async all(sql: string, params: any[] = []): Promise<any[]> { return []; }
  async exec(sql: string): Promise<void> { }
  async transaction(callback: () => Promise<void>): Promise<void> { await callback(); }
}

class MySQLDB implements DBInterface {
  private pool: mysql.Pool;

  constructor() {
    const connectionUri = process.env.DATABASE_URL;
    
    if (connectionUri) {
      this.pool = mysql.createPool(connectionUri);
    } else {
      this.pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'offerwall_db',
        port: parseInt(process.env.DB_PORT || '3306'),
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
    }
  }

  async query(sql: string, params: any[] = []): Promise<any> {
    const [results] = await this.pool.execute(sql, params);
    return results;
  }

  async get(sql: string, params: any[] = []): Promise<any> {
    const [rows] = await this.pool.execute(sql, params);
    return (rows as any[])[0];
  }

  async all(sql: string, params: any[] = []): Promise<any[]> {
    const [rows] = await this.pool.execute(sql, params);
    return rows as any[];
  }

  async exec(sql: string): Promise<void> {
    await this.pool.query(sql);
  }

  async transaction(callback: () => Promise<void>): Promise<void> {
    const connection = await this.pool.getConnection();
    await connection.beginTransaction();
    try {
      await callback();
      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
}

export const db: DBInterface = DB_TYPE === 'mysql' ? new MySQLDB() : new MockSQLiteDB();

export async function initDB() {
  if (DB_TYPE === 'sqlite') {
    console.warn('RUNNING IN MOCK MODE. Please connect a MySQL database.');
    return;
  }

  // MySQL Schema
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY,
      username VARCHAR(255) UNIQUE,
      email VARCHAR(255) UNIQUE,
      password VARCHAR(255),
      points INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS offers (
      id VARCHAR(255) PRIMARY KEY,
      title VARCHAR(255),
      description TEXT,
      reward INT,
      category VARCHAR(255),
      provider VARCHAR(255),
      url VARCHAR(255)
    );
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS completions (
      id VARCHAR(255) PRIMARY KEY,
      user_id VARCHAR(255),
      offer_id VARCHAR(255),
      points_earned INT,
      completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(offer_id) REFERENCES offers(id)
    );
  `);

  // Seed
  const offersCount = await db.get('SELECT count(*) as count FROM offers');
  if (offersCount && offersCount.count === 0) {
    const seedOffers = [
      [uuidv4(), 'Retail Feedback Survey', 'Give your opinion on recent shopping experiences.', 50, 'Survey', 'OpinionPlus', 'https://example.com/survey1'],
      [uuidv4(), 'Tech Trends 2026', 'Share your thoughts on the future of AI.', 100, 'Survey', 'TechInsights', 'https://example.com/survey2'],
      [uuidv4(), 'Mobile Game Trial', 'Download and play "Dragon Quest" for 10 minutes.', 250, 'Offer', 'AppBoost', 'https://example.com/offer1']
    ];
    for (const offer of seedOffers) {
      await db.query('INSERT INTO offers (id, title, description, reward, category, provider, url) VALUES (?, ?, ?, ?, ?, ?, ?)', offer);
    }
  }
}
