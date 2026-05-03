-- OfferGPT MySQL Schema for phpMyAdmin

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  points INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS offers (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  reward INT NOT NULL,
  category VARCHAR(255),
  provider VARCHAR(255),
  url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS completions (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255),
  offer_id VARCHAR(255),
  points_earned INT,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(offer_id) REFERENCES offers(id)
);

-- Optional: Initial Seed Data
INSERT INTO offers (id, title, description, reward, category, provider, url) VALUES 
('offer-1', 'Retail Feedback Survey', 'Give your opinion on recent shopping experiences.', 50, 'Survey', 'OpinionPlus', 'https://example.com/survey1'),
('offer-2', 'Tech Trends 2026', 'Share your thoughts on the future of AI.', 100, 'Survey', 'TechInsights', 'https://example.com/survey2'),
('offer-3', 'Mobile Game Trial', 'Download and play "Dragon Quest" for 10 minutes.', 250, 'Offer', 'AppBoost', 'https://example.com/offer1');
