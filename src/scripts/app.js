const { BrowserWindow, Menu, ipcMain, session } = require('electron')
const url = require('url')
const path = require('path')
const { app } = require('electron/main')

let window
let newitemview
let mainmenu
let datails
let timerwindow
let login
let signup
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
    if (user != undefined) {
        return true
    } else {
        loginWindow()
    }
}

async function mainWindow() {
    middle = await middleWare()
    if (middle === true) {
        window = new BrowserWindow({
            title: 'Practica ElectronJS',
            width: 1000,
            height: 750,
            minHeight:850,
            minWidth:1000,
            fullscreenable: false,
            center: true,
            modal: false,
            webPreferences: {
                nodeIntegration: true,
                worldSafeExecuteJavaScript: true
            },
            close() {
                app.quit();
            }

        })

        window.loadURL(url.format({
            pathname: path.join(__dirname, '../HTML/home.html'),
            slashes: true,
            protocol: 'file'
        }))
        window.setMenu(null)
        window.maximize()
    }
    if (window) {
        window.on('close', (e) => {
            login.close()
        })
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
            newitemview.quit()
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
    timerwindow.setMenu(null)
}

function loginWindow() {

    login = new BrowserWindow({
        height: 500,
        width: 500,
        webPreferences: {
            nodeIntegration: true,
            worldSafeExecuteJavaScript: true
        }
    })
    login.loadURL(url.format(
        {
            pathname: path.join(__dirname, '../HTML/login.html'),
            protocol: "file",
            slashes: true
        }
    ))
    login.setMenu(null)

}
function signupWindow() {

    signup = new BrowserWindow({
        height: 500,
        width: 500,
        webPreferences: {
            nodeIntegration: true,
            worldSafeExecuteJavaScript: true
        }
    })
    signup.loadURL(url.format(
        {
            pathname: path.join(__dirname, '../HTML/signup.html'),
            protocol: "file",
            slashes: true
        }
    ))
    signup.setMenu(null)
    signup.on('close',()=>{
        login.show()
    })

}

function logout() {
    session.defaultSession.cookies.remove('https://localhost/', 'user_id')
        .then((e) => {
            
        })
        .catch((error) => {

        })

}
async function getUser() {
    let user_result
    await session.defaultSession.cookies.get({ name: 'user_id' })
        .then((cookies) => {
            if (cookies) {
                if (cookies[0]) {
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

    login.hide()

})
ipcMain.on('hideSign', (e, m) => {

    signup.hide()

})
ipcMain.on('login:signup', (e, m) => {

    login.hide()
    signupWindow()

})
ipcMain.on('login:saveCookies', (e, user) => {
    value = user.user_id
    session.defaultSession.cookies.set({ url: 'https://localhost/', name: 'user_id', value: value.toString() })
        .then(() => {

        }, (e) => {
            return 'error'
        })

})


ipcMain.on('home:getUser', async (e, m) => {

    let result = await getUser()
    e.returnValue = result
})


module.exports = {
    mainWindow,
    loginWindow
}