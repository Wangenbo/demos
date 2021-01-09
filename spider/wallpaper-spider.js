//导入依赖包
const http = require("http");
const path = require("path");
const url = require("url");
const fs = require("fs");

const superagent = require("superagent");
const cheerio    = require("cheerio");
var result = [];
var flag = false;

for(let i = 1 ; i < 1000; i++) {
    let postUrl = "http://m.bcoderss.com/page/" + i;

    postGet(postUrl).then(($) => {
        $("#main li").each((index, value) => {
            let url = $(value).find('a').attr('href');

            result.push(url)
        })

        fs.writeFileSync('./url1.js', JSON.stringify(result), function(err) {
            //文件路经，写入的内容，回调函数
            if (err) throw new Error('写文件失败' + err)
            console.log('成功写入文件')
        })
    })


    // if(flag) {
    //     superagent
    //         .get(postUrl)
    //         .end((error,response)=>{
    //             var contentIndex = response.text;
    //             var $index = cheerio.load(contentIndex);
    //
    //             console.log(error)
    //
    //             $index("#main li").each((index, value) => {
    //                 let url = $index(value).find('a').attr('href');
    //
    //                 result.push(url);
    //
    //                 console.log(result)
    //                 // fs.writeFileSync('./url1.js', JSON.stringify(result), function(err) {
    //                 //     //文件路经，写入的内容，回调函数
    //                 //     if (err) throw new Error('写文件失败' + err)
    //                 //     console.log('成功写入文件')
    //                 // })
    //                 flag = !flag;
    //                 // superagent
    //                 //     .get(url)
    //                 //     .end((err, resp) => {
    //                 //         var contentPage = resp.text;
    //                 //         var $page = cheerio.load(contentPage);
    //                 //         var src = $page(".single-wallpaper").find('img').attr('src');
    //                 //
    //                 //         result.push(src);
    //                 //
    //                 //
    //                 //     })
    //             });
    //         });
    // }

}

function postGet(postUrl) {

    return new Promise((resolve, reject) => {
        superagent
            .get(postUrl)
            .end((error,response)=>{
                var contentIndex = response.text;
                var $index = cheerio.load(contentIndex);

                if(!error) {
                    resolve($index);
                }else{
                    console.log('post error')
                    reject();
                }
            });
    })

};
