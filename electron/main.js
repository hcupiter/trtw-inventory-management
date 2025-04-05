const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

let mainWindow;
let nextProcess;

// Function to create the Electron window
function createWindow() {
  const iconPath = path.join(__dirname, "..", "assets", "appicon.png");
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    iconPath: iconPath,
    webPreferences: {
      // In production you may want to disable Node integration for security
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Maximize
  mainWindow.maximize();

  // Load url
  mainWindow.loadURL("http://localhost:3000");

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}
// Function to start the Next.js server as a child process
function startNextServer() {
  // Here, we're running "npm run dev". For production, you'll likely run "next start"
  nextProcess = spawn("npm", ["run", "dev"], { shell: true });

  nextProcess.stdout.on("data", (data) => {
    console.log(`Next.js: ${data}`);
  });

  nextProcess.stderr.on("data", (data) => {
    console.error(`Next.js error: ${data}`);
  });
}

// When Electron is ready, start Next.js and then create the window
app.on("ready", () => {
  startNextServer();
  // Wait a few seconds to let Next.js start before creating the window.
  setTimeout(createWindow, 3000);
});

// Quit the app when all windows are closed, and kill the Next.js process
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (nextProcess) nextProcess.kill();
    app.quit();
  }
});

app.on("before-quit", () => {
  if (nextProcess) {
    nextProcess.kill();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
