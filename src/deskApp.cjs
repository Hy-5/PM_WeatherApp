const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  const isDev = process.env.NODE_ENV === 'dev';

  if (isDev) {
    win.loadURL("http://localhost:3000");
  } else {
    const filePath = path.join(__dirname, '../dist/index.html');
    win.loadFile(filePath);
  }
}

app.whenReady().then(createWindow);
