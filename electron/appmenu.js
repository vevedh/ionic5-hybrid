const {
    BrowserWindow,
    Menu,
    app,
    shell,
    dialog
} = require('electron')

let template = [ {
    label: 'Menu',
    submenu: [{
        label: 'Actualiser',
        accelerator: 'CmdOrCtrl+R',
        click: (item, focusedWindow) => {
            if (focusedWindow) {
                // on reload, start fresh and close any old
                // open secondary windows
                if (focusedWindow.id === 1) {
                    BrowserWindow.getAllWindows().forEach(win => {
                        if (win.id > 1) win.close()
                    })
                }
                focusedWindow.reload()
            }
        }
    }, {
        label: 'Plein Ecran',
        accelerator: (() => {
            if (process.platform === 'darwin') {
                return 'Ctrl+Command+F'
            } else {
                return 'F11'
            }
        })(),
        click: (item, focusedWindow) => {
            if (focusedWindow) {
                focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
            }
        }
    },{
        label: 'Portail Web Dev',
        accelerator: 'CmdOrCtrl+W',
        click: (item, focusedWindow) => {
            if (focusedWindow) {
                focusedWindow.loadURL('http://localhost:4300/')
                //shell.openExternal('http://localhost:4300/');
            }
        }
    },{
        label: 'Outils de Debug',
        accelerator: (() => {
            if (process.platform === 'darwin') {
                return 'Alt+Command+I'
            } else {
                return 'Ctrl+Shift+I'
            }
        })(),
        click: (item, focusedWindow) => {
            if (focusedWindow) {
                focusedWindow.toggleDevTools()
            }
        }
    }, {
        type: 'separator'
    }, {
        label: 'Version',
        click: function (item, focusedWindow) {
            if (focusedWindow) {
                const options = {
                    type: 'info',
                    title: `CACEM-ADM Version ${app.getVersion()}`,
                    buttons: ['Ok'],
                    message: 'Cette application est le serveur d\'APIs de la DSI CACEM.'
                }
                dialog.showMessageBox(focusedWindow, options, function () {})
            }
        }
    }]
}]



const appMenu = () => {
    return Menu.buildFromTemplate(template)
}

const addUpdateMenuItems = function (items, position) {
    if (process.mas) return

    const version = app.getVersion();
    let updateItems = [{
        label: `Version ${version}`,
        enabled: false
    }, {
        label: 'Checking for Update',
        enabled: false,
        key: 'checkingForUpdate'
    }, {
        label: 'Check for Update',
        visible: false,
        key: 'checkForUpdate',
        click: () => {
            require('electron').autoUpdater.checkForUpdates()
        }
    }, {
        label: 'Restart and Install Update',
        enabled: true,
        visible: false,
        key: 'restartToUpdate',
        click: () => {
            require('electron').autoUpdater.quitAndInstall()
        }
    }]

    items.splice.apply(items, [position, 0].concat(updateItems))
}

const findReopenMenuItem = function () {
    const menu = Menu.getApplicationMenu()
    if (!menu) return

    let reopenMenuItem
    menu.items.forEach(item => {
        if (item.submenu) {
            item.submenu.items.forEach(item => {
                if (item.key === 'reopenMenuItem') {
                    reopenMenuItem = item
                }
            })
        }
    })
    return reopenMenuItem
}



exports.appMenu = appMenu
exports.addUpdateMenuItems = addUpdateMenuItems
exports.findReopenMenuItem = findReopenMenuItem
