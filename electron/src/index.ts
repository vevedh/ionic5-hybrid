import {
  app,
  Menu,
  screen,
  nativeImage,
  Tray,
  ipcMain,
  dialog,
  BrowserWindow,
  MenuItem,
} from "electron";
import { createCapacitorElectronApp } from "@capacitor-community/electron-core";

const isDev = require("electron-is-dev");

const path = require("path");

const log = require("electron-log");

log.info("Dev :", isDev);

// ---   arguments possible de l'application
// ---  soit --serve  ou --debug
const serve = /--serve/.test(process.argv[2]);
const debug = /--debug/.test(process.argv[2]);

log.info(`Start application using --serve `, serve);

// The MainWindow object can be accessed via myCapacitorApp.getMainWindow()
const myCapacitorApp = createCapacitorElectronApp();

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";

app.disableHardwareAcceleration();
app.allowRendererProcessReuse = true;

let mainWindow: BrowserWindow;
let trayIcon = null;
let traymenu: Menu;
let willQuitApp = false;
let pids = [];
let appPath;

const toggleWindow = () => {
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    showWindow();
  }
};

const showWindow = () => {
  mainWindow.show();
  mainWindow.focus();
};

/**
 *   Context Menu
 */
let app_context_menu = [
  {
    label: "Quitter",
    accelerator: "CmdOrCtrl+Q",
    click: () => {
      willQuitApp = true;
      if (process.platform != "darwin")
        log.info("Nombre de process : ", pids.length);
      pids.forEach((proc) => {
        proc.kill();
      });
      app.quit();
    },
  },
];

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some Electron APIs can only be used after this event occurs.
// tslint:disable-next-line: quotemark
app.on("ready", () => {
  myCapacitorApp.init();

  mainWindow = myCapacitorApp.getMainWindow();

  // icone dans la barre des tâches
  trayIcon = new Tray(
    nativeImage.createFromPath(
      path.join(
        app.getAppPath(),
        "assets",
        process.platform === "win32" ? "appIcon.ico" : "appIcon.png"
      )
    )
  ); 
  trayIcon.on("right-click", toggleWindow);
  trayIcon.on("double-click", toggleWindow);
  trayIcon.on("click", (event) => {
    toggleWindow();
  });

  traymenu = Menu.buildFromTemplate(app_context_menu);
  trayIcon.setToolTip(app.getName());
  trayIcon.setContextMenu(traymenu);

  // initialisation des menus
  mainWindow.setMenu(null);
  if (isDev) {
    // Menu.setApplicationMenu(appmenu.appMenu());
  }

  if (serve) {
    log.info("Using Serve");
  }

  mainWindow.webContents.on("did-start-navigation", (event, url) => {
    log.info("navigation url :", url);
  });

  mainWindow.on("close", (e) => {
    // willQuitApp = true;
    if (willQuitApp) {
      // server.close();
      console.log("Nombre de process = ", pids.length);
      pids.forEach((proc) => {
        proc.kill();
      });
      mainWindow = null;
    } else {
      log.info("Event close ", willQuitApp);
      e.preventDefault();
      mainWindow.hide();
    }
  });
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (myCapacitorApp.getMainWindow() === null) {
    myCapacitorApp.init();
  }
});

// Define any IPC or other custom functionality below here
