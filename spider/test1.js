(async() => {
    // for(let i = 0; i < 100; i++) {
    //     await sleep(2000);
    //
    //     console.log(i);
    // }

    let list = [1,2,3,4,5,6,7,8,9,10];

    list.forEach((item, index)=> {
        await sleep(2000);

        console.log(index);
    })



    function sleep(time = 0) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, time);
        })
    };
})()




