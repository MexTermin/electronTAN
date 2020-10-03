const {app} = require('electron')
const {mainWindow} = require('./view/app')
require('electron-reload')(__dirname)
require('./database/db')
// const {getConnection} = require('./database/db')

app.allowRendererProcessReuse = true
app.whenReady().then(async ()=>{
    // getConnection()
    mainWindow()
})