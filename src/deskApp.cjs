const { ipcMain, app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const { registerUser, loginUser, updateUser } = require('./db/sqlite.js');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  const isDev = process.env.NODE_ENV === 'dev';
  win.loadURL(isDev
    ? 'http://localhost:3000'
    : url.format({
        pathname: path.join(__dirname, '../dist/index.html'),
        protocol: 'file:',
        slashes: true
      })
  );
}

app.setName('pmweather');
app.whenReady().then(() => {
  console.log('User data path:', app.getPath('userData'));
  createWindow();
});

// IPC Handlers
ipcMain.handle('register-user', (event, { username, password, location, lat, lon }) => {
  return registerUser(username, password, location, lat, lon);
});

ipcMain.handle('login-user', (event, { username, password }) => {
  return loginUser(username, password);
});

ipcMain.handle('update-user', (event, userData) => {
  return updateUser(userData);
});