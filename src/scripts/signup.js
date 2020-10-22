const signup = document.querySelector("#form-signup")
const { ipcRenderer } = require('electron/renderer')
const {getConnection} = require('../database/db')
if (signup){
    signup.addEventListener('submit', async e =>{
        e.preventDefault()
        const conn = await getConnection()
        let email = e.target.email.value
        let password =  e.target.password.value
        let name =  e.target.name.value
        let result = await conn.query('insert into  users set ?;', {email,password,name})
        console.log(result.insertId)
        if(result){
            ipcRenderer.send('login:saveCookies',{user_id:result.insertId})
            ipcRenderer.send('hideSign')
            ipcRenderer.send('homeWindow')
        }

    })

}

let sign = document.querySelector('#btn-log')
sign.addEventListener('click',()=>{
    window.close()
})


