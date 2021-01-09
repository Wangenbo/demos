
    const mysql = require('mysql');
    const fs = require('fs');
    const superagent = require("superagent");
    const cheerio    = require("cheerio");

    fs.readFile('./url1.js', 'utf8' , (err, data) => {

        (async() => {
            if (err) {
                console.error(err)
                return
            }

            const list = JSON.parse(data);

            // list.length = 60;

            const connection = mysql.createConnection({
                host     : 'localhost',
                user     : 'root',
                password : '123456',
                database : 'wallpaper'
            });

            connection.connect();

            const  addSql = 'INSERT INTO url(url) VALUES(?)';

            for(let i = 0; i < list.length; i++) {
                await sleep(80);

                postGet(list[i]).then(($) => {
                        let src = $(".single-wallpaper").find('img').attr('src');

                        connection.query(addSql, src,function (err, result) {
                            if(err){
                                console.log('[INSERT ERROR] - ',err.message);
                                return;
                            }
                            console.log('SUCCESSED--------------------------INSERT----------------------------' + i);
                        });
                    }).catch((err)=> {
                        console.log(err)
                    })
            }
            // connection.end();
        })()
    });

    function sleep(time = 0) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, time);
        })
    };

    function postGet(postUrl) {
        return new Promise((resolve, reject) => {
            superagent
                .get(postUrl)
                .end((error,response)=>{

                    if(response != undefined && typeof response.text == 'string') {
                        var contentIndex = response.text;
                        var $ = cheerio.load(contentIndex);

                        if(!error) {
                            resolve($);
                        }else{
                            console.log('post error')
                            reject(error);
                        }
                    }else{
                        reject(error);
                    }

                });
        })
    };





