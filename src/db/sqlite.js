const path = require('path');
const { app } = require('electron');
const Database = require('better-sqlite3');

// db location
const dbPath = app.isPackaged
  ? path.join(process.resourcesPath, 'users.db')
  : path.join(__dirname, 'users.db');

const db = new Database(dbPath);

// Create table with new history columns
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    location TEXT,
    lat REAL,
    lon REAL,
    historyDate_range TEXT,
    historyLocation TEXT
  )
`).run();

// For existing DBs: add columns if they don't exist
try {
  db.prepare(`ALTER TABLE users ADD COLUMN historyDate_range TEXT`).run();
} catch (e) {
  // Column already exists
}
try {
  db.prepare(`ALTER TABLE users ADD COLUMN historyLocation TEXT`).run();
} catch (e) {
  // Column already exists
}

// Registration (unchanged)
function registerUser(username, password, location, lat, lon) {
  try {
    db.prepare(
      'INSERT INTO users (username, password, location, lat, lon) VALUES (?, ?, ?, ?, ?)'
    ).run(username, password, location, lat, lon);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// Login (unchanged)
function loginUser(username, password) {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?');
  const user = stmt.get(username, password);
  return user
    ? { success: true, user }
    : { success: false, error: 'Invalid credentials' };
}

// Update user profile, now handling history fields
function updateUser({ id, username, password, location, lat, lon, historyDate_range, historyLocation }) {
  try {
    const assignments = ['username = ?', 'password = ?', 'location = ?'];
    const params = [username, password, location];

    if (lat !== undefined && lon !== undefined) {
      assignments.push('lat = ?', 'lon = ?');
      params.push(lat, lon);
    }
    if (historyDate_range !== undefined) {
      assignments.push('historyDate_range = ?');
      params.push(historyDate_range);
    }
    if (historyLocation !== undefined) {
      assignments.push('historyLocation = ?');
      params.push(historyLocation);
    }

    const sql = `UPDATE users SET ${assignments.join(', ')} WHERE id = ?`;
    params.push(id);
    const stmt = db.prepare(sql);
    const result = stmt.run(...params);

    if (result.changes === 0) {
      return { success: false, error: 'User not found or no changes made' };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

module.exports = { registerUser, loginUser, updateUser };