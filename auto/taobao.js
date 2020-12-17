app.launchApp("手机淘宝");
// 延迟2s 等待资源加载完毕
sleep(2000);

// 另起线程，监控音量下键 终止程序
overjs();

// log======================================================
console.show();
log("抢购=======================" + "\n");
log("初始化完毕" + "\n");
log("等待进入详情页面" + "\n");
log("进入成功" + "\n");
log("开始点击" + "\n");
// log======================================================

var count = 0;
var total = 5000;
var timer = setInterval(() => {
    count++;
    var buttonBuy = textContains('立即购买').find();
    var buttonSubmit = textContains('提交订单').find();

    console.log(buttonBuy)
    // 判断按钮-立即抢购
    if (buttonBuy.length > 0) {
        // console.log(button)
        jdClickButton(buttonBuy[0]);

        if (count >= total) {
            clearInterval(timer);
            log("立即抢购点击执行完毕" + "\n");
        }
    }

    // 判断按钮-提交订单
    if (buttonSubmit.length > 0) {
        jdClickButton(buttonSubmit[0]);

        if (count >= total) {
            clearInterval(timer);
            log("提交订单点击执行完毕" + "\n");
        }
    }
}, 10)


// 
/**
 * 根据控件的坐标范围随机模拟点击（京东用）
 * @param button
 */
function jdClickButton(button) {
    var bounds = button.bounds();
    var width = bounds.right - bounds.left;
    var high = bounds.top - bounds.bottom;
    // press(random(bounds.left + width / 4, bounds.right - width / 4), random(bounds.top + high / 3, bounds.bottom - high / 3), random(50, 100));
    press( random(bounds.right, bounds.left), random(bounds.bottom, bounds.top), random(50, 100) );
    log('点击执行+1')
}

/**
 * 范围随机数生成
 * @param min
 * @param max
 */
function random(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

/**
 * 启用按键监听，按下音量下键脚本结束
 * @param min
 * @param max
 */
function overjs() {
    threads.start(function () {//在子进程中运行监听事件
        events.observeKey();
        events.on("key", function (code, event) {
            var keyCodeStr = event.keyCodeToString(code);
            console.log(code);
            console.log(keyCodeStr);
            if (keyCodeStr == "KEYCODE_VOLUME_DOWN") {
                toast("程序已结束。");
                exit();
            }
        });
    });
}



