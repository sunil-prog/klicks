const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create/connect to SQLite database (file named "authdb.sqlite3" in backend root)
const db = new sqlite3.Database(path.resolve(__dirname, 'authdb.sqlite3'), (err) => {
    if (err) {
        console.error('Database opening error: ', err);
    }
});

// Initialize users table
db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);
});

module.exports = db;
