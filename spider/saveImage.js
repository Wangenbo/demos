const request = require("request");
const fs = require("fs");
const http = require("http");
const mysql = require('mysql');
const async = require('async');

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '123456',
    database : 'wallpaper'
});

connection.connect();

connection.query(`SELECT * FROM url limit 10000`, function (error, results, fields) {
    if (error) throw error;

    for(let i = 0; i < results.length; i++) {
        let url = setUrl(results[i].url);
        let path = "./image/" + getImageName(results[i].url);

        // request.get(url).on('error', function (err) {
        //     console.log(err);
        // }).pipe(fs.createWriteStream("./image/" + getImageName(results[i].url)))
        //     .on('close', function() {
        //     console.log('done', i+1);
        // })

        download(url, path, i);
    }

});
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

function download(url, filename, index) {
    http.get(url, function(res){
        var imgData = "";

        res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开
        res.on("data", function(chunk){ //这步是我百度来的。。。。
            imgData+=chunk;
        });

        res.on("end", function(){
            fs.writeFileSync(filename, imgData, "binary", function(err){
                if(err){
                    console.log("down fail", index);
                }
                console.log("down success", index);
            });
        });
    });
}