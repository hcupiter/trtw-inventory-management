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
  const waitOn = require("wait-on");
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

  // Use wait-on to poll the server URL
  const opts = {
    resources: ["http://localhost:3000"],
    delay: 1000,
    interval: 1000,
    timeout: 30000, // wait up to 30 seconds
  };

  waitOn(opts, (err) => {
    if (err) {
      console.error("Error waiting for Next.js server:", err);
      app.quit();
    } else {
      createWindow();
    }
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
