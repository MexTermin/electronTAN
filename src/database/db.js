const mysql = require('promise-mysql')

const conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'mytodo'
})

function  getConnection(){
     return  conn
}

module.exports = {

    getConnection
}