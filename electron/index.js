const { app, BrowserWindow, Menu, screen, nativeImage, Tray, ipcMain, dialog } = require('electron');
const log = require("electron-log");
const isDevMode = require('electron-is-dev');
const { CapacitorSplashScreen, configCapacitor } = require('@capacitor/electron');

const path = require('path');

// ----- class par defaut pour le menu de l'application
const appmenu = require('./appmenu');

//---- librairie qui permet d'avoir les infos système
const si = require('systeminformation');

// -----   Base de donnée
const MongoClient = require('mongodb').MongoClient;

//----  exécution de scripts powershell
const powershell = require('node-powershell');


//-----  gestion de fichiers
const jetpack = require('fs-jetpack');

const serve = /--serve/.test(process.argv[2]);

const appVersion = app.getVersion();

// chemin de l'application une fois installée
const appPath = app.appPath;

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

// Place holders for our windows so they don't get garbage collected.
let mainWindow = null;

// Placeholder for SplashScreen ref
let splashScreen = null;

//Change this if you do not wish to have a splash screen
let useSplashScreen = true;
let trayIcon = null;
let traymenu = null;
let willQuitApp = false;
let pids = [];

let el_settings;


/**
 *   Context Menu
 */
let app_context_menu = [{
  label: 'Quitter',
  accelerator: 'CmdOrCtrl+Q',
  click: () => {
    willQuitApp = true;
    if (process.platform != 'darwin')
      console.log("Nombre de process = ", pids.length);
    pids.forEach(function (proc) {
      proc.kill();
    });
    app.quit();
  }
}];



const runPowerShell = (cmd) => {
  var psw = new powershell({
    executionPolicy: 'Bypass',
    outputEncoding: 'utf-8',
    noProfile: true
  });

  return new Promise(function (resolve, reject) {
    psw.addCommand(`$OutputEncoding = [console]::InputEncoding = [console]::OutputEncoding = New-Object System.Text.UTF8Encoding`)
    psw.addCommand(cmd)
      .then(() => psw.invoke()
        .then((res) => {
          //log.info("Résulat brut :",res);
          psw.dispose();
          resolve(res);
        }, (reason) => {
          reject(reason);
        })
      )
  });
}


// Create simple menu for easy devtools access, and for demo
const menuTemplateDev = [
  {
    label: 'Options',
    submenu: [
      {
        label: 'Open Dev Tools',
        click() {
          mainWindow.openDevTools();
        },
      },
    ],
  },
];


// toggle window
const toggleWindow = () => {
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    showWindow();
  }
}

const showWindow = () => {
  mainWindow.show()
  mainWindow.focus()
}

async function createWindow () {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize; 

  // Define our main window size
  mainWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      preload: path.join(__dirname, 'node_modules', '@capacitor', 'electron', 'dist', 'electron-bridge.js')
    }
  });
  //mainWindow.hide();

  configCapacitor(mainWindow);

  if (isDevMode) {
    // Set our above template to the Menu Object if we are in development mode, dont want users having the devtools.
    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplateDev));
    // If we are developers we might as well open the devtools by default.
    mainWindow.webContents.openDevTools();
  }



  if (serve) {
    mainWindow.loadURL('http://localhost:4200')
  } else {
    if(useSplashScreen) {
      splashScreen = new CapacitorSplashScreen(mainWindow);
      splashScreen.init();
    } else {
      mainWindow.loadURL(`file://${__dirname}/app/index.html`);
      mainWindow.webContents.on('dom-ready', () => {
        mainWindow.show();
      });
    }
  }

  // icone dans la barre des tâches
  trayIcon = new Tray(nativeImage.createFromPath(path.join(__dirname, '/icons/png/512x512.png')));
  trayIcon.on('right-click', toggleWindow)
  trayIcon.on('double-click', toggleWindow)
  trayIcon.on('click', function (event) {
    toggleWindow()
  })


  traymenu = Menu.buildFromTemplate(app_context_menu);
  trayIcon.setToolTip('CACEM ADM Serveur ');
  trayIcon.setContextMenu(traymenu);


      // initialisation des menus
  mainWindow.setMenu(null);
  Menu.setApplicationMenu(appmenu.appMenu());
  //appmenu.addUpdateMenuItems(Menu.getApplicationMenu().items,1);
  //appmenu.findReopenMenuItem();
  mainWindow.webContents.on("did-start-navigation", (event, url) => {
        log.info("Did-start-navigation", {
          url
        });
  });


  mainWindow.on('ready-to-show', (e) => {
    if (!isDev) {
      //autoUpdater.checkForUpdatesAndNotify();
    }
  });

  mainWindow.on('close', (e) => {

    //willQuitApp = true;
    if (willQuitApp) {
      //server.close();
      console.log("Nombre de process = ", pids.length);
      pids.forEach(function (proc) {
        proc.kill();
      });
      mainWindow = null;

    } else {
      log.info("Event close ", willQuitApp);
      e.preventDefault();
      mainWindow.hide();
    }
  });


}




app.allowRendererProcessReuse = true;

function sendStatusToWindow(text) {
  log.info(text);
  mainWindow.webContents.send('message', text);
}

// Pour n'autoriser qu'une seule exécution de l'application
let iShouldQuit = app.requestSingleInstanceLock();

process.on("uncaughtException", (err) => {
  if (err.message == "write EBADF") {
    const messageBoxOptions = {
      type: "warning",
      title: "Une seule intance du programme est autorisée !",
      message: err.message
    };
    dialog.showMessageBox(messageBoxOptions);
  } else {
    log.info("Erreur :", err.message + ":" + err.name);
    if (err.message.search('getaddrinfo') <= 0) {
     
    }

  }

  //throw err;
});

log.info("Nombre d'arguments :" + process.argv.length.toString());


if (!iShouldQuit) {
  app.quit();
} else {

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some Electron APIs can only be used after this event occurs.
app.on('ready', createWindow);
}

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// Define any IPC or other custom functionality below here
