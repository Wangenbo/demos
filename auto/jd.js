var id = "100012043978";

app.launchApp("京东");
sleep(5000);

console.show();
    log("抢购茅台=======================" + "\n");
    log("Author: Wilbur" + "\n");
    log("初始化完毕" + "\n");
    log("等待进入茅台详情页面" + "\n");
app.startActivity({
    action: "VIEW",
    data: "openapp.jdmobile://virtual?params=%7B%22sourceValue%22:%220_productDetail_97%22,%22des%22:%22productDetail%22,%22skuId%22:%22"+id+"%22,%22category%22:%22jump%22,%22sourceType%22:%22PCUBE_CHANNEL%22%7D"
});
    log("进入成功" + "\n");
    sleep(5000);
    log("开始点击" + "\n");
    var count = 0;
    var total = 500;
    var timer = setInterval(()=> {
        count++;
        // log("点击 +1" + "\n");
        var button = textContains('已预约').find();

        // console.log(button)
        jdClickButton(button[1]);

        if(count >= total) {
            clearInterval(timer);
            log("执行完毕" + "\n");
        }
    }, 50)

/**
 * 根据控件的坐标范围随机模拟点击（京东用）
 * 京东任务按钮有圆角，通用的随机点击方法容易点出圆角外导致点击失效，此处做修正
 * @param button
 */
function jdClickButton(button) {
    var bounds = button.bounds();
    var width = bounds.right - bounds.left;
    var high = bounds.top - bounds.bottom;
    press(random(bounds.left + width / 4, bounds.right - width / 4), random(bounds.top + high / 3, bounds.bottom - high / 3), random(50, 100));
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



