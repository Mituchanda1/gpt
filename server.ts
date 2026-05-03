import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db, initDB } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'survey-gpt-secret-key-123';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Database
  await initDB();

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ error: 'Forbidden' });
      req.user = user;
      next();
    });
  };

  // API Routes
  app.post('/api/auth/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const id = uuidv4();
      await db.query('INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)', [id, username, email, hashedPassword]);
      
      const token = jwt.sign({ id, username, email }, JWT_SECRET, { expiresIn: '24h' });
      res.cookie('token', token, { httpOnly: true });
      res.json({ id, username, email, points: 0, token });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
      if (!user) return res.status(400).json({ error: 'User not found' });

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

      const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
      res.cookie('token', token, { httpOnly: true });
      res.json({ id: user.id, username: user.username, email: user.email, points: user.points, token });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/api/user/profile', authenticateToken, async (req: any, res) => {
    const user = await db.get('SELECT id, username, email, points FROM users WHERE id = ?', [req.user.id]);
    res.json(user);
  });

  app.get('/api/offers', authenticateToken, async (req, res) => {
    const offers = await db.all('SELECT * FROM offers');
    res.json(offers);
  });

  app.post('/api/offers/complete', authenticateToken, async (req: any, res) => {
    const { offerId } = req.body;
    const offer = await db.get('SELECT * FROM offers WHERE id = ?', [offerId]);
    if (!offer) return res.status(404).json({ error: 'Offer not found' });

    try {
      // Handle transaction
      const userId = req.user.id;
      const points = offer.reward;

      if (process.env.DB_TYPE === 'mysql') {
        await db.transaction(async () => {
          const completionId = uuidv4();
          await db.query('INSERT INTO completions (id, user_id, offer_id, points_earned) VALUES (?, ?, ?, ?)', [completionId, userId, offerId, points]);
          await db.query('UPDATE users SET points = points + ? WHERE id = ?', [points, userId]);
        });
      } else {
        // SQLite transaction is synchronous in this specific wrapper, but we'll use the same pattern
        const completionId = uuidv4();
        await db.query('INSERT INTO completions (id, user_id, offer_id, points_earned) VALUES (?, ?, ?, ?)', [completionId, userId, offerId, points]);
        await db.query('UPDATE users SET points = points + ? WHERE id = ?', [points, userId]);
      }

      const updatedUser = await db.get('SELECT points FROM users WHERE id = ?', [userId]);
      res.json({ success: true, pointsEarned: points, currentPoints: updatedUser.points });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite Middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
