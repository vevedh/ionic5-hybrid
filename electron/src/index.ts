import { app, Menu, screen, nativeImage, Tray, ipcMain, dialog } from "electron";
import { createCapacitorElectronApp } from "@capacitor-community/electron-core";

const isDev = require('electron-is-dev');

const log = require("electron-log");

log.info('Dev :', isDev);

//---   arguments possible de l'application
//---  soit --serve  ou --debug
const serve = /--serve/.test(process.argv[2]);
const debug = /--debug/.test(process.argv[2]);

log.info(`Start application using --serve `, serve);

// The MainWindow object can be accessed via myCapacitorApp.getMainWindow()
const myCapacitorApp = createCapacitorElectronApp();

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";

app.disableHardwareAcceleration();
app.allowRendererProcessReuse = true;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some Electron APIs can only be used after this event occurs.
// tslint:disable-next-line: quotemark
app.on("ready", () => {

  myCapacitorApp.init();

  if (serve) {
    log.info("Using Serve")
  }


  myCapacitorApp.getMainWindow().webContents.on("did-start-navigation", (event, url) => {
    log.info("navigation url :", url);
  });

});

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (myCapacitorApp.getMainWindow() === null) {
    myCapacitorApp.init();
  }
});

// Define any IPC or other custom functionality below here
