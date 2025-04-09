const { app, BrowserWindow } = require("electron");
const path = require("path");
require(loginHandler);

import "./ipchandlers";

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"), // make sure this file exposes ipcRenderer properly
    },
  });

  // Load the static export's entry point (index.html) from the out directory.
  mainWindow.loadFile(path.join(__dirname, "..", "out", "index.html"));
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
