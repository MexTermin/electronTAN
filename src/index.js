const {app} = require('electron')
const {mainWindow} = require('./scripts/app')
require('electron-reload')(__dirname)
require('./database/db')
// const {getConnection} = require('./database/db')

app.allowRendererProcessReuse = true
app.whenReady().then(async ()=>{
    // getConnection()
    mainWindow()

    // app.on("will-quit",  ()=> {
        //     app.quit();
        //   });
    })
app.on("windows-all-closed",  ()=> {
    app.quit();
    });
