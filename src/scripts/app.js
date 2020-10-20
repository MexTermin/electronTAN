const { BrowserWindow, Menu, ipcMain, session } = require('electron')
const url = require('url')
const path = require('path')

let window
let newitemview
let mainmenu
let datails
let timerwindow
let login
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
async function middleWare() {
    let user = await getUser()
    // console.log(user)
    if (user != undefined) {
        return true
    } else {
        loginWindow()
    }
}

async function mainWindow() {
    middle = await middleWare()
    // console.log('middle es ', middle)
    if (middle === true) {
        window = new BrowserWindow({
            title: 'Practica ElectronJS',
            width: 1000,
            height: 750,
            fullscreenable: false,
            center: true,
            modal:false,
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
        window.setMenu(mainmenu)
        window.maximize()
    }
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

function timeTracker() {
    timerwindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            worldSafeExecuteJavaScript: true
        }
    })

    timerwindow.loadURL(url.format({
        pathname: path.join(__dirname, "../html/timer.html"),
        protocol: "file",
        slashes: true
    }
    ))
}

function loginWindow() {

    login = new BrowserWindow({
        height: 500,
        width: 500,
        webPreferences: {
            nodeIntegration: true,
            worldSafeExecuteJavaScript: true
        },
        close(){
            e.preventDefault()
        }
    })
    login.loadURL(url.format(
        {
            pathname: path.join(__dirname, '../HTML/login.html'),
            protocol: "file",
            slashes: true
        }
    ))

}

function logout(){
    session.defaultSession.cookies.remove('https://localhost/','user_id')
    .then((e)=>{
        console.log(e)
    })
    .catch((error)=>{

    })

}
async function  getUser() {
    let user_result
    await session.defaultSession.cookies.get({ name: 'user_id' })
        .then((cookies) => {
            if (cookies) {
                // console.log(cookies[0].value)
                if(cookies[0]){
                    user_result = cookies[0].value
                }
            }
            else {
                user_result = undefined
            }
        })
        .catch((error) => {
            console.log(error)
        })
    return user_result
}

//-------------------all webcontens-----------------------
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
ipcMain.on('homeWindow', (e, m) => {
    mainWindow()
})
ipcMain.on('closeLogin', (e, m) => {
   login.on('close',(e)=>{
        e.preventDefault();
        login.hide()
   })
})
ipcMain.on('login:saveCookies', (e, user) => {
    value = user.user_id
    // console.log('received')
    session.defaultSession.cookies.set({ url: 'https://localhost/', name: 'user_id', value: value.toString() })
        .then(() => {

        }, (e) => {
            return 'error'
        })

})


ipcMain.on('home:getUser', async (e, m) => {
    // console.log('searching')
    let result = await getUser()
    e.returnValue = result
})


module.exports = {
    mainWindow,
    loginWindow
}