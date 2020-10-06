const { BrowserWindow, Menu, ipcMain } = require('electron')
const url = require('url')
const path = require('path')

let window
let newitemview
let mainmenu
let datails
let timerwindow

if (Menu) {
    mainmenu = Menu.buildFromTemplate([
        {

            label: 'Options',
            submenu: [
                { label: 'New', accelerator: "Ctrl+N", click() { newitem() } }
                , { label: 'DevTools', click(e, focusedWindow) { focusedWindow.toggleDevTools() } }
            ]
        }
    ])
}

function mainWindow() {
    window = new BrowserWindow({
        title: 'Practica ElectronJS',
        width: 1000,
        height: 750,
        fullscreenable: false,
        center: true,
        // titleBarStyle:"customButtonsOnHover",
        webPreferences: {
            nodeIntegration: true,
            worldSafeExecuteJavaScript: true
        }

    })

    window.loadURL(url.format({
        pathname: path.join(__dirname, '../HTML/home.html'),
        slashes: true,
        protocol: 'file'
    }))
    // menu = window
    // window.setMenu(null)
    window.setMenu(null)
    window.maximize()
}

function newitem() {
    newitemview = new BrowserWindow({
        height: 500,
        width: 500,
        modal: true,
        parent: window,
        webPreferences: {
            worldSafeExecuteJavaScript: true,
            nodeIntegration: true
        },
        resizable: false,
        close() {
            newitem.quit()
        }
    })
    newitemview.setMenu(null)
    newitemview.loadURL(url.format({
        pathname: path.join(__dirname, '../HTML/additem.html'),
        protocol: 'file',
        slashes: true
    }))
}

function detailswindow(id) {

    datails = new BrowserWindow({
        height: 500,
        width: 500,
        modal: true,
        parent: window,
        resizable: false,
        webPreferences: {
            worldSafeExecuteJavaScript: true,
            nodeIntegration: true

        }
    })
    datails.loadURL(url.format({
        pathname: path.join(__dirname, '../HTML/details.html'),
        protocol: 'file',
        slashes: true
    }))
    datails.setMenu(null)
    datails.webContents.send('home:id', id)

    datails.webContents.on('did-finish-load', () => {
        datails.webContents.send('home:id', id)
    })

}

function timeTracker(){
    timerwindow = new BrowserWindow({
        webPreferences:{
            nodeIntegration:true,
            worldSafeExecuteJavaScript:true
        }
    })
    
}


ipcMain.on('home:id', (e, id) => {
    detailswindow(id)
})
ipcMain.on('home:update', (e, m) => {
    window.webContents.send('home:update', m)
})
ipcMain.on('home:addbutton', (e, m) => {
    newitem()
})
ipcMain.on('home:timeTracker', (e, m) => {
    timeTracker()
})


module.exports = {
    mainWindow
}