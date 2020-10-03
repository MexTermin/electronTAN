const { ipcRenderer } = require('electron')
const { getConnection } = require('../database/db')

async function main() {

    let ename = document.querySelector("#name-details")
    let edone = document.querySelector("#done-details")
    let edes = document.querySelector("#description-details")
    let form =  document.querySelector('#form-details')
    let con
    ipcRenderer.on('home:id',async (e, id) => {
        con = await getConnection()
        let result = await con.query('select * from todo where note_id like ?', id.note)
        ename.value = result[0].name
        edone.checked = result[0].done === 1 ? true: false
        edes.value = result[0].description
        form.setAttribute('user',result[0].id)
        form.setAttribute('note',result[0].note_id)
        // console.log(result[0])
    })
    
    form.addEventListener('submit',async (e)=>{
        e.preventDefault()
        let name = e.target.querySelector('#name-details').value
        let done = e.target.querySelector("#done-details").checked
        let description = e.target.querySelector("#description-details").value
        let user = e.target.getAttribute('user')
        let not = e.target.getAttribute('note')
        const update = {
            name,
            description,
            done
        }
        let result = await con.query('update todo set ? where note_id like ? and id like ?; ', [update,not,user])
        ipcRenderer.send('home:update',{message:"actualizar pagina"})
        window.close()
    })

}
main()