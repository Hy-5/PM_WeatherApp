const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('db', {
  registerUser: (data) => ipcRenderer.invoke('register-user', data),
  loginUser: (data) => ipcRenderer.invoke('login-user', data)
});
