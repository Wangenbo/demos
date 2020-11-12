/*
 * @Author: Wilbur
 * @Date: 2020年11月12日10:50:13
 * @Desc: 通过adb 实现秒杀抢购功能
 * @param:   null @ Object
 */

const { exec } = require('child_process')
const path = require('path')
const AppActivity = 'com.ss.android.ugc.aweme/com.ss.android.ugc.aweme.splash.SplashActivity'
const PACKAGE_NAME = 'com.ss.android.ugc.aweme' //APP的包名
const PACKAGE_NAME_JD = 'com.jingdong.app.mall'
/*
 * @Author: Wilbur
 * @Date: 2020年11月12日11:04:26
 * @Desc: 执行 shell 脚本
 * @param:   command@String
 */
const fnExecShell = (command) => {
    return new Promise((resolve, reject) => {

        exec(command, (err, stdout, stderr) => {
            if (err) {
                console.log(err)
                reject(new Error(err + ''))
            }else{
                console.log(command, '\n')
                resolve(stdout)
            }
        })
    })
}

/*
 * @Author: Wilbur
 * @Date: 2020年11月12日11:04:31
 * @Desc: 检查应用是否安装
 */
const checkPackageIsInstall = () => {
    const shell = `adb shell pm list packages`

    return fnExecShell(shell)
}

/*
 * @Author: Wilbur
 * @Date: 2020年11月12日11:04:36
 * @Desc: 打开APP
 */
const openApp = () => {
    const shell = `adb shell am start -n ${AppActivity}`
    return fnExecShell(shell)
}

/*
 * @Author: Wilbur
 * @Date: 2020年11月12日11:04:41
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
 * @Date: 2020年11月12日11:04:46
 * @Desc: 点击屏幕
 */

const touchScreen = (point) => {
    const { x, y } = point
    const shell = `adb shell input tap ${x} ${y}`

    return fnExecShell(shell)
}

/*
 * @Author: Wilbur
 * @Date: 2020年11月12日11:04:51
 * @Desc: 延迟执行函数
 */
function awaitMoment (time = 2000) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), time)
    })
}

/*
 * @Author: Wilbur
 * @Date: 2020年11月12日11:04:51
 * @Desc: 循环执行函数
 */
function intervalTap (time = 1000) {
    return new Promise((resolve) => {
        setInterval(() => resolve(), time)
    })
}

/*
 * @Author: Wilbur
 * @Date: 2020年11月12日11:04:56
 * @Desc: 主函数，入口
 */
(function mian () {
    // let radomFileName =  new Date().getTime() + '_' + ((Math.random(1) * 100).toFixed(2))

    // takeScreenshot('/sdcard/' + radomFileName + '.png').then(()=> {
    //     console.log('屏幕快照已复制至images')

    //     let tempPath = './images/' + radomFileName + '.png'
    //     let tempImage = image2base64(tempPath); //将文件转换为base64格式

    //     faceRecognition(tempImage).then((data)=> {
    //         console.log(data);
    //     })
    // })

    checkPackageIsInstall().then((res)=> {

        if(res.indexOf(PACKAGE_NAME) > -1) { //检查手机中是否安装APP
            // 打开APP
            openApp().then(()=>{
                console.log('APP 启动成功')
            })

            console.log('等待APP初始化....')


            awaitMoment(10000).then(()=> {
                console.log('APP内容初始化完毕');
                let point = {x: 340, y: 520};
                let count = 0;
                let total = 100;

                let timer = setInterval(()=> {
                    count++;
                    if(count >= total) {
                        clearInterval(timer);
                    }else{
                        touchScreen(point).then(()=>{
                            console.log('用户点击了1次')
                        });
                    }
                }, 500);
            })


        }else{
            console.log('您还未安装指定应用')
        }
    })
})()
