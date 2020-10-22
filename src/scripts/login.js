const formLogin = document.querySelector("#form-login")
const { ipcRenderer } = require('electron/renderer')
const {getConnection} = require('../database/db')
if (formLogin){
    formLogin.addEventListener('submit', async e =>{
        e.preventDefault()
        const conn = await getConnection()
        let email = e.target.email.value
        let password =  e.target.password.value
        let result = await conn.query('select * from users where password like ? and email like ?', [password,email])
        if(result){
            ipcRenderer.send('login:saveCookies',{user_id:result[0].user_id})
            console.log('sending') 
            ipcRenderer.send('homeWindow',{})
            ipcRenderer.send('closeLogin',{})
        }

    })

}

let sign = document.querySelector('#btn-sign')
sign.addEventListener('click',()=>{
    ipcRenderer.send('login:signup')
})


