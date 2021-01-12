const request = require("request");
const fs = require("fs");
const mysql = require('mysql');

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '123456',
    database : 'wallpaper'
});
const dir = './image/'

var start = 1;

connection.connect();


downImage(start).then(()=> {});


function setUrl(url) {
    const URL = 'http://m.bcoderss.com';
    let tempUrl = encodeURI(url);

    if(tempUrl.indexOf('http://') == -1) {
        tempUrl = URL + tempUrl;
    }

    return tempUrl;
};

function getImageName(url) {
    const matches = url.match(/(?<=.*\/)[^\/\?]+(?=\?|$)/)
    const fileName = matches && matches[0];

    return fileName;
}

function sleep(time = 0) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    })
};


function downImage(start_id) {
    let sql = 'SELECT * FROM url WHERE id = ' + (start_id);

    console.log('开始下载第：' + start_id + '张');
    return new Promise((resolve, reject) => {
        connection.query(sql, function (error, results, fields) {
            if (error){
                reject(error);
                throw error;
            }

            let url = setUrl(results[0].url);

            let fullPath = dir + getImageName(results[0].url);

            // 如果文件不存在
            fs.exists(fullPath, (exists)=> {
                if(!exists) {
                    request.get(url).on('error', function (err) {
                        console.log(err);
                    }).pipe(fs.createWriteStream(dir + getImageName(results[0].url)))
                        .on('close', function() {
                            start++;
                            console.log('已经完成：', start_id);

                            if(start <= 10000) {
                                downImage(start);
                            }
                            resolve();
                        })
                }else{
                    start++;
                    downImage(start);
                    console.log('文件已经存在');
                }


            })
        });
    })
}