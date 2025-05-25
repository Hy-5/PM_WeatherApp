const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  const isDev = process.env.NODE_ENV === 'dev';

  if (isDev) {
    win.loadURL('http://localhost:3000');
  } else {
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, '../dist/index.html'),
        protocol: 'file:',
        slashes: true,
      })
    );
  }
}

app.whenReady().then(createWindow);
