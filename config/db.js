const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "..", "db.sqlite");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // SQL syntax
  db.run(`
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      fullName TEXT NOT NULL,
      passwordHash TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);

  // Videos table for favorites
  db.run(`
    CREATE TABLE IF NOT EXISTS Videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      videoTitle TEXT NOT NULL,
      videoId TEXT NOT NULL,
      thumbnailUrl TEXT,
      description TEXT,
      savedAt TEXT NOT NULL,
      position INTEGER DEFAULT 0,
      FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
      UNIQUE(userId, videoId)
    )
  `);
});
// isAdmin INTEGER NOT NULL DEFAULT 0 --- added line to the table

module.exports = db;