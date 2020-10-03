const { BrowserWindow,Menu, ipcMain, ipcRenderer} = require('electron')
const url = require('url')
const path = require('path')

let window
let newitemview
let mainmenu
let datails
if (Menu){
    mainmenu = Menu.buildFromTemplate([
        {
            label: 'Options',
            submenu: [
                { label: 'New', accelerator: "Ctrl+N", click() { newitem() } },
                { label: 'DevTools', click(e, focusedWindow) { focusedWindow.toggleDevTools() } }
            ]
        }
    ])
}

function mainWindow() {
        window = new BrowserWindow({
        title: 'Practica ElectronJS',
        width: 1000,
        height: 750,
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
    window.setMenu(mainmenu)
}

function newitem() {
        newitemview = new BrowserWindow({
        height: 500,
        width: 500,
        modal:true,
        parent:window,
        webPreferences: {
            worldSafeExecuteJavaScript: true,
            nodeIntegration:true
        },
        close(){
            newitem.quit()
        }
    })
    newitemview.setMenu(mainmenu)
    newitemview.loadURL(url.format({
        pathname:path.join(__dirname,'../HTML/additem.html'),
        protocol:'file',
        slashes:true
    }))
}

function detailswindow(id){

    datails = new BrowserWindow({
        height: 500,
        width: 500,
        webPreferences: {
            worldSafeExecuteJavaScript: true,
            nodeIntegration:true

    }
    })
    datails.loadURL(url.format({
        pathname:path.join(__dirname,'../HTML/details.html'),
        protocol:'file',
        slashes:true
    }))
    datails.setMenu(mainmenu)
    datails.webContents.send('home:id',id)
    
    datails.webContents.on('did-finish-load', ()=>{
        datails.webContents.send('home:id',id)
    })
    
}
ipcMain.on('home:id',(e,id)=>{
    detailswindow(id)
})
ipcMain.on('home:update',(e,m)=>{
    window.webContents.send('home:update',m)
})


module.exports = {
    mainWindow
}