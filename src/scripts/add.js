const { ipcRenderer } = require('electron')
const { getConnection } = require('../database/db')
let formadd = document.querySelector('#form-add')
let user = ipcRenderer.sendSync('home:getUser', { message: 'el user pls' })
formadd.addEventListener('submit', async (e) => {
    e.preventDefault()
    let name = e.target.name.value
    let description = e.target.description.value
    let done = e.target.done.checked
    let dates
    if (name != '') {
        dates = {
            name, description, done, user
        }
    }
    else {
        dates = {
            description, done, user
        }
    }
    const connect = await getConnection()
    let ms = document.querySelector('#message')
    try {
        await connect.query('INSERT INTO  todo set ?', dates)
        e.target.name.value = ''
        e.target.description.value = ''
        e.target.done.checked = false
        ms.textContent = 'Saved Correctly'
        ms.style = 'color:lightgreen; text-shadow: gray 1px 1px 3px;'
        ipcRenderer.send('home:update', { message: "actualizar pagina" })
    } catch (e) {
        ms.textContent = 'Save Error'
        ms.style = 'color:red; text-shadow: gray 1px 1px 3px;'
    }
})


let btn = document.querySelector('.btn-danger')
btn.addEventListener("click", (e) => {
    window.close()

})