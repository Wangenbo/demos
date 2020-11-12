const fs = require('fs');
const path = require('path');
const mimeType = require('mime-types');

function image2base64(file) {
    let filePath = path.resolve(file); // 原始文件地址
    let fileMimeType = mimeType.lookup(filePath); // 获取文件的 memeType

    // 如果不是图片文件，则退出
    if (!fileMimeType.toString().includes('image')) {
        return false;
    }

    // 读取文件数据
    let data = fs.readFileSync(filePath);
    data = new Buffer(data).toString('base64');
    // 转换为 data:image/jpeg;base64,***** 格式的字符串
    let base64 = 'data:' + fileMimeType + ';base64,' + data;

    return base64
}

module.exports = image2base64