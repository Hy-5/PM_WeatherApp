const path = require('path');
const { app } = require('electron');
const Database = require('better-sqlite3');

// db location
const dbPath = app.isPackaged 
  ? path.join(process.resourcesPath, 'users.db')
  : path.join(__dirname, 'users.db');
const db = new Database(dbPath);

// Create table | consider alter
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    location TEXT,
    lat REAL,
    lon REAL
  )
`).run();


// Registration and data to save
function registerUser(username, password, location, lat, lon) {
  try {
    db.prepare('INSERT INTO users (username, password, location, lat, lon) VALUES (?, ?, ?, ?, ?)')
      .run(username, password, location, lat, lon);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}


// Login if creds are valid
function loginUser(username, password) {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?');
  const user = stmt.get(username, password);
  return user
    ? { success: true, user }
    : { success: false, error: 'Invalid credentials' };
}


module.exports = { registerUser, loginUser };
