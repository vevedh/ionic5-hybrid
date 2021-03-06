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
import { createCapacitorElectronApp } from "@capacitor-community/electron";

const isDev = require("electron-is-dev");

const path = require("path");

const loggger = require('winston'); //require("electron-log");  // require('electron-timber');

loggger.info("Dev :", isDev);

// ---   arguments possible de l'application
// ---  soit --serve  ou --debug
const serve = /--serve/.test(process.argv[2]);
const debug = /--debug/.test(process.argv[2]);

loggger.info(`Start application using --serve `, serve);
loggger.info('Path :',app.getAppPath());

console.log('Path :',app.getAppPath());

//loggger.info('Path :', path.resolve(path.join(app.getAppPath(),'../..','svrapis/src/app.js')) );

// The MainWindow object can be accessed via myCapacitorApp.getMainWindow()
const myCapacitorApp = createCapacitorElectronApp({
  trayMenu: {
    useTrayMenu: true,
    trayIconPath: path.join(
      app.getAppPath(),
      "assets",
      process.platform === "win32" ? "appIcon.ico" : "appIcon.png"
    ),
    trayContextMenu: [new MenuItem({
       label: "Quitter",
        accelerator: 'CmdOrCtrl+Q',
        click: () => {
          willQuitApp = true;
          if (process.platform != 'darwin')
            console.log("Nombre de process = ", pids.length);
            pids.forEach((proc) => {
              proc.kill();
            });
            app.quit();
        }
      })],
  }
});


process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";

app.disableHardwareAcceleration();
app.allowRendererProcessReuse = true;

let mainWindow: BrowserWindow;
let willQuitApp = false;
let pids = [];
let proc = null;
let appPath;
let trayIcon : Tray = null;


const startSvrFeatherJS = () => {
  
  

  
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some Electron APIs can only be used after this event occurs.
app.on("ready", () => {
  myCapacitorApp.init();

  
  
  mainWindow = myCapacitorApp.getMainWindow();

  // The TrayIcon object can be accessed via myCapacitorApp.getTrayIcon()
  trayIcon = myCapacitorApp.getTrayIcon();

  loggger.log("TrayIcon :",trayIcon);

  // initialisation des menus
  //mainWindow.setMenu(null);

  if (isDev) {
    // Menu.setApplicationMenu(appmenu.appMenu());
    //startSvrFeatherJS();
  }

  if (serve) {
    loggger.info("Using Serve");
  }

  mainWindow.webContents.on("did-start-navigation", (event, url) => {
    loggger.info("navigation url :", url);
  });

  
  mainWindow.on("close", (e) => {
    
     //willQuitApp = true;
    if (willQuitApp) {
      // server.close();
      console.log("Nombre de process to kill = ", pids.length);
      proc.destroy().then(() => {
        console.log('Destroyed!')
      })
      pids.forEach((proc) => {
        //console.log('proc :',proc)
        //proc.kill();
        proc.destroy().then(() => {
          console.log('Destroyed!')
        })
      });
      mainWindow = null;
    } else {
      loggger.info("Event close ", willQuitApp);
      
      e.preventDefault();
      mainWindow.hide();
     
    }
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