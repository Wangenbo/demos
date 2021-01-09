const mysql = require('mysql');
const fs = require('fs');

fs.readFile('./url1.js', 'utf8' , (err, data) => {
    if (err) {
        console.error(err)
        return
    }

    const list = JSON.parse(data);

    const connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '123456',
        database : 'wallpaper'
    });

    connection.connect();

    const  addSql = 'INSERT INTO page(url) VALUES(?)';

    list.forEach((item, index) => {
        connection.query(addSql, item,function (err, result) {
            if(err){
                console.log('[INSERT ERROR] - ',err.message);
                return;
            }

            console.log('--------------------------INSERT----------------------------');
            console.log('SUCCESSED');
            console.log('-----------------------------------------------------------------\n\n');
        });
    });
    connection.end();
})