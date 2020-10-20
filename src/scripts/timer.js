const { ipcRenderer } = require('electron/renderer')
const { getConnection } = require('../database/db')
let conection
//-------------------------------------------Variables-----------------------------------------
let nodeIntervar
let user =  ipcRenderer.sendSync('home:getUser',{message:'el user pls'})
function twobinary(number) {
    /*
        this function convert one number in 0+number for represent a valid data time
        example:
            twobinary(8) : output 08
    */
    number = number.toString()
    if (number.length < 2) {
        return "0" + number.toString()
    } else {
        return number.toString()
    }
}
function inserTime(id, name, time) {
    const cont = document.querySelector(".bottom-section")
    old = cont.querySelectorAll('.card-timer')
    // old.forEach(e=>{
    //     console.log(old[1])

    // })

    // cont.innerHTML =""
    cont.innerHTML += `
                <div class="card-timer" id='${id}'>
                    <input type="text" name="name" id="name" value='${name}' class='name-control'>
                    <span class='time-view'>${time}</span>
                    <div class="options">
                        <button class='btn btnl btnresume' id='' > Resume</button>
                        <button class='btn btnl btndelete' > Delete</button>
                        <button class='btn btnl btnupdate' id=''> Update</button>
                    </div>
                </div>
                `

    // if (old.length > 0) {
    //     // console.log(old)
    //     old.forEach(e => {

    //         // console.log(e)
    //         cont.appendChild(e)


    //     })
    // }
    // cont.appendChild(old)
}

function relog(node) {
    /*
        this function  behaves like a time incrementor
        example:
            relog("00:00:00") : output = "00:00:01"
            relog("00:59:59") : output = "01:00:00"
    */
    let rsecond
    let rminutes
    let rhours
    let actuallynoder


    if (node.textContent === '') {
        node.textContent = "00:00:00"
    }
    const split = node.textContent.split(":")
    const hour = parseInt(split[0])
    const minutes = parseInt(split[1])
    const second = parseInt(split[2])

    if (second === 59) {
        rsecond = '00'
        if (minutes === 59) {
            rminutes = '00'
            rhours = twobinary(hour + 1)
        } else {
            rminutes = twobinary(minutes + 1)
            rhours = twobinary(hour)
        }
    }
    else {
        rsecond = twobinary(second + 1)
        rminutes = twobinary(minutes)
        rhours = twobinary(hour)
    }

    actuallynoder = rhours + ":" + rminutes + ":" + rsecond
    node.textContent = actuallynoder

}

function startTime() {
    const timer = document.querySelector('#time');
    if (timer) {
        if (!nodeIntervar) {
            nodeIntervar = setInterval(() => {
                relog(timer)
            }, 1000);
        } else {
            clearInterval(nodeIntervar)
            nodeIntervar = setInterval(() => {
                relog(timer)
            }, 1000);
        }
    };

};

function stopTime() {
    clearInterval(nodeIntervar)

}


const startb = document.querySelector('#btnstart')
const stoptb = document.querySelector("#btnstop")
startb.addEventListener('click', (e) => {
    e.preventDefault()
    startTime()
    startb.disabled = true
    stoptb.disabled = false
})

stoptb.addEventListener("click", async (e) => {
    e.preventDefault()
    stopTime()
    startb.disabled = false
    stoptb.disabled = true
    // const con = await getConnection()
    const name = document.querySelector('#time-name').value
    const time = document.querySelector('#time').textContent
    const update =  document.querySelector('#btnstop').getAttribute('update')
    try {
        if(update === 'true'){
            conection.query('update timer set ? where id_time like ? and user like ?',[{name,time},id,user])
            document.querySelector('#btnstop').removeAttribute('update')
        }else{
            conection.query("insert into timer set ?", { user, name, time })
        }
        document.querySelector('#time-name').value = ""
        document.querySelector('#time').textContent = "00:00:00"
        timers()
        // inserTime(result.insertId,name,time)
    } catch (e) {
        console.log(e)
    }



})

const btnclrear = document.querySelector("#btnClear")
btnclrear.addEventListener("click", (e) => {
    document.querySelector('#time-name').value = ""
    document.querySelector('#time').textContent = "00:00:00"
    stopTime()
    startb.disabled = false
    stoptb.disabled = true
})

function configbtnd() {
    let btndelete = document.querySelectorAll(".btndelete")
    let btnupdate = document.querySelectorAll('.btnupdate')
    let btnresume = document.querySelectorAll('.btnresume')
    let inputname= document.querySelectorAll(".name-control")
    if (btndelete) {
        btndelete.forEach(b => {
            b.addEventListener('click', async () => {
                let id = b.parentNode.parentNode.id
                const father = document.querySelector(".bottom-section")
                await conection.query('delete from timer where user like ? and id_time like ? ;', [user, id])
                father.removeChild(b.parentNode.parentNode)

            })
        })
    }

    if (btnupdate) {
        btnupdate.forEach(b => {
            b.addEventListener('click', async (e) => {
                e.preventDefault()
                value = b.parentNode.parentNode.querySelector('#name').value
                id = b.parentNode.parentNode.getAttribute('id')
                const result = conection.query('update timer set ? where id_time like ? and user like ?',[{name:value},id,user])
                // console.log(result.changedRows)
                timers()
                b.disabled = true
                // console.log('yes')
            })
        })
    }
    if(btnresume){
        btnresume.forEach(b=>{
            b.addEventListener('click',(e)=>{
                e.preventDefault()
                value = b.parentNode.parentNode.querySelector('#name').value
                id = b.parentNode.parentNode.getAttribute('id')
                time = b.parentNode.parentNode.querySelector('.time-view').textContent
                document.querySelector('#time-name').value = value
                document.querySelector('#time').textContent = time
                document.querySelector("#main-form-time").setAttribute('timeId',`${id}`)
                document.querySelector('#btnstop').setAttribute('update',true)
                document.querySelector('#btnstart').click()
            })
        })
    }

    if(inputname){
        inputname.forEach(i=>{
            i.addEventListener("keyup",()=>{
                const target = i.parentNode.querySelector('.btnupdate')
                target.disabled = false
            })
        })
    }
}
async function timers() {
    const result = await conection.query("select * from timer where user like ? order by id_time desc ;", user)

    if (result) {
        document.querySelector(".bottom-section").innerHTML = ''
        result.forEach((e) => {
            inserTime(e.id_time, e.name, e.time)

        })
    }
    configbtnd()
}

document.addEventListener('DOMContentLoaded', async () => {
    conection = await getConnection()
    await timers()
    // await configbtnd()
})