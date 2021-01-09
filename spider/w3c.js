// 用于发送http请求
const https = require('https')
const http = require('http')
// 用于提取网页中的img标签
const cheerio = require('cheerio')
// 用于将http响应中的数据写到文件中
const fs = require('fs')
// 用于获取系统文件分隔符
const path = require('path')
const sep = path.sep
// 用于存储图片和网页的文件夹路径
const imgDir = `${__dirname}${sep}image${sep}`
const pageDir = `${__dirname}${sep}pages${sep}`

// https协议名
const HTTPS = 'https:'
// 若文件夹不存在则创建
for (const dir of [imgDir, pageDir]) {
    if (!fs.existsSync(dir)) {
        console.log('文件夹(%s)不存在,即将为您创建', dir)
        fs.mkdirSync(dir)
    }
}

// const url = 'http://gee2dan.com/'
const url = 'https://www.w3cschool.cn/'

// 下载中的图片数量
let downloadingCount = 0

downloadImgsOn(url)

// 下载指定网站包含的图片
function downloadImgsOn(url) {
    // URL作为options
    const options = new URL(url);
    // 获取协议
    const protocol = options.protocol
    // 根据协议选择发送请求的模块
    const _http = protocol === HTTPS ? https : http
    // 发送请求
    const req = _http.request(options, (res) => {
        // 用于存储返回的html数据
        let htmlData = ''
        res.on('data', (chunk) => {
            htmlData += chunk.toString('utf8')
        })
        res.on('end', () => {
            // 将html数据存储到文件中,可用于人工校验
            const htmlFileName = `${pageDir}result.html`
            fs.writeFile(htmlFileName, htmlData, () => {
                console.log('页面(%s)读取完毕,已保存至(%s)', url, htmlFileName)
            })
            // 将html信息转换为类jq对象
            const $ = cheerio.load(htmlData)
            const imgs = $('img')
            // 用于保存需要下载的图片url,去除重复的图片url
            const imgUrlSet = new Set()
            imgs.each((index, img) => {
                // 获取图片url
                let imgUrl = img.attribs.src
                // 将不完整的图片url转完成完整的图片url
                if (imgUrl.startsWith('//')) {
                    imgUrl = protocol + imgUrl
                } else if (imgUrl.startsWith('/')) {
                    imgUrl = url + imgUrl
                }
                imgUrlSet.add(imgUrl)
            })
            console.log('获取图片url共%s个', imgUrlSet.size)
            // 下载imgUrlSet中包含的图片s
            for (const imgUrl of imgUrlSet) {
                downloadImg(imgUrl)
            }
        })
    })
    req.on('error', (err) => {
        console.error(err)
    })
    req.end();
}

/**
 * 打印当前正在下载的图片数
 */
function printDownloadingCount() {
    console.log('当前下载中的图片有%s个', downloadingCount)
}

/**
 * 下载指定url对应的图片
 * @param {*} imgUrl 目标图片url
 * @param {*} maxRetry 下载失败重试次数
 * @param {*} timeout 超时时间毫秒数
 */
function downloadImg(imgUrl, maxRetry = 10, timeout = 10000) {
    /**
     * 用于下载失败后重试
     */
    function retry() {
        if (maxRetry) {
            console.log('(%s)剩余重试次数:%s,即将重试', imgUrl, maxRetry);
            downloadImg(imgUrl, maxRetry - 1);
        } else {
            console.log('(%s)下载彻底失败', imgUrl)
        }
    }

    // URL作为options
    const options = new URL(imgUrl);
    // 根据协议选择发送请求的模块
    const _http = options.protocol === HTTPS ? https : http
    // 从url中提取文件名
    const matches = imgUrl.match(/(?<=.*\/)[^\/\?]+(?=\?|$)/)
    const fileName = matches && matches[0]
    // 请求关闭时是否需要重新请求
    let retryFlag = false

    const req = _http.request(options, (res) => {
        console.log('开始下载图片(%s)', imgUrl)
        downloadingCount += 1
        printDownloadingCount()
        // 判断数据是否为图片类型,仅保存图片类型
        const contentType = res.headers['content-type']
        if (contentType.startsWith('image')) {
            // 存储图片数据到内存中
            const chunks = []
            res.on('data', (chunk) => {
                chunks.push(chunk)
            })
            // req.on('abort') 中相同的操作也可以写在 res.on('aborted') 中
            // res.on('aborted', () => {})
            res.on('end', () => {
                downloadingCount -= 1
                printDownloadingCount()
                // 若响应正常结束,将内存中的数据写入到文件中
                if (res.complete) {
                    console.log('图片(%s)下载完成', imgUrl)
                    write(imgDir + fileName, chunks, 0)
                } else {
                    console.log('(%s)下载结束但未完成', imgUrl)
                }
            })
        }
    })
    req.on('error', (err) => {
        console.error(err)
        retryFlag = true
    })
    req.on('abort', () => {
        console.log('下载(%s)被中断', imgUrl)
        retryFlag = true
    })
    req.on('close', () => {
        if (retryFlag) {
            retry()
        }
    })
    // 如果超时则中止当前请求
    req.setTimeout(timeout, () => {
        console.log('下载(%s)超时', imgUrl)
        req.abort()
    })
    req.end()
}

/**
 * 将数据块数组chunks中第index个数据块写入到distFileName对应文件的末尾
 * @param {*} distFileName 数据将写入的文件名
 * @param {*} chunks 图片数据块数组
 * @param {*} index 写入数据块的索引
 */
function write(distFileName, chunks, index) {
    if (index === 0) {
        var i = 0
        // 判断文件是否重名,若重名则重新生成带序号的文件名
        let tmpFileName = distFileName
        while (fs.existsSync(tmpFileName)) {
            tmpFileName = distFileName.replace(new RegExp(`^(.*?)([^${sep}\\.]+)(\\..*|$)`), `$1$2_${i}$3`)
            i += 1
        }
        distFileName = tmpFileName
    }
    // 获取图片数据块依次写入文件
    const chunk = chunks[index]
    if (chunk) {
        // 异步、递归
        fs.appendFile(distFileName, chunk, () => {
            write(distFileName, chunks, index + 1)
        })
    } else {
        console.log('文件(%s)写入完毕', distFileName)
    }
}