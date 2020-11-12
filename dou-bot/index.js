const image2base64 = require('./untils/img2base64')
const faceRecognition = require('./face/tencent-cloud')
const { exec } = require('child_process')
const path = require('path')
const AppActivity = 'com.ss.android.ugc.aweme/com.ss.android.ugc.aweme.splash.SplashActivity'
const PACKAGE_NAME = 'com.ss.android.ugc.aweme' //APP的包名


/*
 * @Author: Wilbur
 * @Date: 2020-07-10 09:50:29
 * @Desc: 执行 shell 脚本
 * @param:   command@String
 */

const fnExecShell = (command) => {
    return new Promise((resolve, reject) => {
        console.log(command, '\n')

        exec(command, (err, stdout, stderr) => {
            if (err) {
                console.log(err)
                reject(new Error(err + ''))
            }else{
                resolve(stdout)
            }
        })
    })
}

/*
 * @Author: Wilbur
 * @Date: 2020-07-10 10:00:30
 * @Desc: 打开APP
 */
const openApp = () => {
    const shell = `adb shell am start -n ${AppActivity}`
    return fnExecShell(shell)
}

/*
 * @Author: Wilbur
 * @Date: 2020-07-10 16:10:25
 * @Desc: 滑动屏幕
 */
const swipeScreen = (a = { x: 300, y: 1000 }, b = { x: 300, y: 640 }, ms = 200) => {
    const { x: x1, y: y1 } = a
    const { x: x2, y: y2 } = b
    const shell = `adb shell input swipe ${x1} ${y1} ${x2} ${y2} ${ms}`

    return fnExecShell(shell)
}

/*
 * @Author: Wilbur
 * @Date: 2020-07-10 16:10:46
 * @Desc: 点击屏幕
 */

const touchScreen = (point) => {
    const { x, y } = point
    const shell = `adb shell input tap ${x} ${y}`
    return fnExecShell(shell)
}

/*
 * @Author: Wilbur
 * @Date: 2020-07-11 13:58:56
 * @Desc: 获取屏幕快照
 */
const takeScreenshot = (filename) => {
    const shell = `adb shell screencap ${filename}` //获取屏幕快照

    return new Promise((resolve) => {
        fnExecShell(shell).then(()=>{
            console.log('屏幕快照获取成功')
            fnExecShell(`adb pull ${filename} ./images/`).then(() => {
                resolve();
            }) //将屏幕快照复制到当前目录
        })
    })

}


const checkPackageIsInstall = () => {
    const shell = `adb shell pm list packages`

    return fnExecShell(shell)
}

/*
 * @Author: Wilbur
 * @Date: 2020-07-10 16:11:03
 * @Desc: 延迟执行函数
 */
function awaitMoment (time = 2000) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), time)
    })
}

/*
 * @Author: Wilbur
 * @Date: 2020-07-10 16:11:22
 * @Desc: 主函数，入口
 */
(function mian () {
    let radomFileName =  new Date().getTime() + '_' + ((Math.random(1) * 100).toFixed(2))

    takeScreenshot('/sdcard/' + radomFileName + '.png').then(()=> {
        console.log('屏幕快照已复制至images')

        let tempPath = './images/' + radomFileName + '.png'
        let tempImage = image2base64(tempPath); //将文件转换为base64格式

        faceRecognition(tempImage).then((data)=> {
            console.log(data);
        })
    })
    // checkPackageIsInstall().then((res)=> {

    //     if(res.indexOf(PACKAGE_NAME) > -1) { //检查手机中是否安装APP
    //         // 打开APP
    //         openApp().then(()=>{
    //             console.log('APP 启动成功')
    //         })

    //         console.log('等待APP初始化....')


    //         awaitMoment(5000).then(()=> {
    //             console.log('APP内容初始化完毕')
    //         })


    //     }else{
    //         console.log('您还未安装抖音APP')
    //     }
    // })
})()