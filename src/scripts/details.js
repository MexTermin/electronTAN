const { ipcRenderer } = require('electron')
const { getConnection } = require('../database/db')
let user = ipcRenderer.sendSync('home:getUser', { message: 'el user pls' })
function wclose() {
    /*
        this function do the refresh  of note list page, and close de window
    */
    ipcRenderer.send('home:update', { message: "actualizar pagina" })
    window.close()
}

async function main() {  // <------this is the main function
    //-------------------------Variables-------------------------
    let ename = document.querySelector("#name-details")
    let edone = document.querySelector("#done-details")
    let edes = document.querySelector("#description-details")
    let form = document.querySelector('#form-details')
    let edelete = document.querySelector('#delete')
    let con

    ipcRenderer.on('home:id', async (e, id) => {
        /* 
            home:id is a even that send de note list page with the id of the note selected
        */
        con = await getConnection()
        let result = await con.query('select * from todo where note_id like ? and user like ?', [id.note, user])
        ename.value = result[0].name
        edone.checked = result[0].done === 1 ? true : false
        edes.value = result[0].description
        form.setAttribute('note', result[0].note_id) // <----------- i adapted the  note id on de form for more easy search him
        // console.log(result[0])
    })

    form.addEventListener('submit', async (e) => {
        /*
            this function update the dates of the note when you clicked oin the save button
            this function don't return anything
        */
        e.preventDefault()
        let name = e.target.querySelector('#name-details').value
        let done = e.target.querySelector("#done-details").checked
        let description = e.target.querySelector("#description-details").value
        // let user = e.target.getAttribute('user')
        let not = e.target.getAttribute('note')
        const update = { // < ----- object that contain de new info
            name,
            description,
            done
        }
        await con.query('update todo set ? where note_id like ? and user like ?; ', [update, not, user])
        wclose()
    })
    edelete.addEventListener('click', async (e) => {
        /*
            this function delete the select note, it made when you clicked in the delete button
        */
        // const user = form.getAttribute('user')
        const not = form.getAttribute('note')
        console.log('hello')
        try {
            const conf = confirm('Are you sure to delete  this note?')
            if (conf === true) {
                con = await getConnection()
                con.query('delete from todo where note_id like ? and user like ?', [not, user])
                wclose()

            }
        } catch (e) {
            alert(e.message)
        }
    })

}
main()