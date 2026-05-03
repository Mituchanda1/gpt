import mysql from 'mysql2/promise';
import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';

let DB_TYPE = process.env.DB_TYPE || 'sqlite';

// Auto-detect mysql if DATABASE_URL starts with mysql://
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

class SQLiteDB implements DBInterface {
  private db: any;

  constructor() {
    this.db = new Database('database.sqlite');
  }

  async query(sql: string, params: any[] = []): Promise<any> {
    const stmt = this.db.prepare(sql);
    return stmt.run(...params);
  }

  async get(sql: string, params: any[] = []): Promise<any> {
    return this.db.prepare(sql).get(...params);
  }

  async all(sql: string, params: any[] = []): Promise<any[]> {
    return this.db.prepare(sql).all(...params);
  }

  async exec(sql: string): Promise<void> {
    this.db.exec(sql);
  }

  async transaction(callback: () => Promise<void>): Promise<void> {
    const trx = this.db.transaction(callback);
    return trx();
  }
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
    // MySQL handles multiple statements differently, split by semicolon if needed
    // or just execute one by one. For table creation, we'll execute the whole block.
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

export const db: DBInterface = DB_TYPE === 'mysql' ? new MySQLDB() : new SQLiteDB();

export async function initDB() {
  if (DB_TYPE === 'sqlite') {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT,
        points INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS offers (
        id TEXT PRIMARY KEY,
        title TEXT,
        description TEXT,
        reward INTEGER,
        category TEXT,
        provider TEXT,
        url TEXT
      );

      CREATE TABLE IF NOT EXISTS completions (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        offer_id TEXT,
        points_earned INTEGER,
        completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(offer_id) REFERENCES offers(id)
      );
    `);
  } else {
    // MySQL Schema (slightly different types)
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
  }

  // Seed
  const offersCount = await db.get('SELECT count(*) as count FROM offers');
  if (offersCount.count === 0) {
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
