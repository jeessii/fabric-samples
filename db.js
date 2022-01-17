import mysql from 'mysql';

var conexion = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    database: 'web_bol',
    user: 'root',
    password: 'secret',
    port: "3306"  
});

conexion.getConnection((err, connection) => {
    if (err) throw (err)
    console.log("DB connected successful with ID: " + connection.threadId)
})

export default conexion;