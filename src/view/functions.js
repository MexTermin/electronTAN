const { ipcRenderer } = require('electron')
const { getConnection } = require('../database/db')


let formadd = document.querySelector('#form-add')

formadd.addEventListener('submit', async (e) => {
    e.preventDefault()
    // console.log(e.target)
    let id = 1
    let name = e.target.name.value
    let description = e.target.description.value
    let done = e.target.done.checked
    let dates
    if (name != '') {
        dates = {
            id, name, description, done
        }
    }
    else {
        dates = {
            id, description, done
        }
    }
    const connect = await getConnection()
    let ms = document.querySelector('#message')
    try {
        const result = await connect.query('INSERT INTO  todo set ?', dates)
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
    }
)

