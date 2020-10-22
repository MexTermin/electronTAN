const {app} = require('electron')
const {mainWindow} = require('./scripts/app')
require('./database/db')

app.allowRendererProcessReuse = true
app.whenReady().then(async ()=>{

    mainWindow()
    })
app.on("windows-all-closed",  ()=> {
    app.quit();
    });
