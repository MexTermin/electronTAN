const { getConnection } = require('../database/db')
const { ipcRenderer } = require('electron')
let user = ipcRenderer.sendSync('home:getUser', { message: 'el user pls' })



async function getallid() {
    const connect = await getConnection()
    try {
        const result = await connect.query('select * from  todo where  user like ? order by note_id DESC', user)
        return result
    } catch (e) {
        console.log(e.message)
    }

}

async function writeitems() {
    let result = await getallid()
    if (result) {
        let cont = document.getElementsByClassName('items-container')[0]
        cont.innerHTML = ""

        result.forEach((e) => {
            cont.innerHTML += `<div class='card-item d${e.done}' done='${e.done}' id=${e.note_id}>
                                    <div class="scroll-v">
                                        <div class='div-name'>
                                            <h4>${e.name} </h4>
                                        </div>
                                    </div>
                                   <div class="">
                                   </div>
                               </div>`
        })

    }
    let w = document.querySelectorAll('.div-name')
    if (w.length > 0) {

        w.forEach((e) => {
            e.addEventListener('wheel', (j) => {
                if (j.deltaY > 0) e.scrollLeft += 100;
                else e.scrollLeft -= 100;
            })

        })
    }

    let cards = document.querySelectorAll('.card-item')
    cards.forEach((item) => {
        item.addEventListener('mousedown', () => {
            item.style = 'box-shadow:white 0px 0px 20px;'

        }, false)
        item.addEventListener('mouseup', () => {
            item.style = 'box-shadow:white 0px 0px 0px;'

        }, false)
        item.addEventListener('click', () => {
            ipcRenderer.send('home:id', { note: item.id })

        })

    })
}

function buttonHomeAdd() {
    const add = document.querySelector('.add-button')
    add.addEventListener('click', () => {
        ipcRenderer.send('home:addbutton', { messaje: 'add new item' })
    })
    add.addEventListener('mousedown', () => {
        add.style = ' box-shadow: gray 0px 0px 10px;'
    })
    add.addEventListener('mouseup', () => {
        add.style = ' box-shadow: gray 0px 0px 0px;'
    })
}

function buttonTimer() {
    const button = document.querySelector(".timer-button")
    button.addEventListener('click', () => {
        ipcRenderer.send('home:timeTracker', { message: 'Time tracker' })
    })
    button.addEventListener('mousedown', () => {
        button.style = ' box-shadow: gray 0px 0px 10px;'
    })
    button.addEventListener('mouseup', () => {
        button.style = ' box-shadow: gray 0px 0px 0px;'
    })
}

function main() {
    writeitems()
    buttonHomeAdd()
    buttonTimer()
    ipcRenderer.on('home:update', () => {
        writeitems()
    })

    ipcRenderer.send('home:getUser', { message: 'hello' })

}

main()