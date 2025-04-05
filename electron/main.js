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

  if (process.platform === "darwin") {
    app.dock.setIcon(iconPath);
  }

  // Load url
  mainWindow.loadURL("http://localhost:3000");

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function startNextServer() {
  nextProcess = spawn("npm", ["run", "dev"], {
    shell: true,
    detached: true,
  });

  nextProcess.stdout.on("data", (data) => {
    console.log(`Next.js: ${data}`);
  });

  nextProcess.stderr.on("data", (data) => {
    console.error(`Next.js error: ${data}`);
  });
}

function killNextServer() {
  if (nextProcess) {
    // On Unix-like systems, a negative PID kills the entire group.
    try {
      process.kill(-nextProcess.pid);
      console.log("Killed Next.js server process group.");
    } catch (error) {
      console.error("Error killing Next.js server process group:", error);
    }
  }
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
    killNextServer();
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
