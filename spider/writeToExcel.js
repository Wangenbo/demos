const xlsx = require('xlsx');

//excel

    // let arrayData = [
    //     ['姓名1', '电话', '税率', '单价', '数量', '含税金额', '不含税金额', '税额', '付款状态', '付款方式', '创建时间', '上传更新时间'],
    //     ['小毛', '15888884444', '7%', '1000', '10', '10700', '10000', '700', '已付', '刷卡', '2019-08-07 10：51：17', '2019-08-12 18：03：20'],
    //     ['二毛', '158888833333', '10%', '10', '10', '110', '100', '10', '已付', '支付宝', '2019-08-07 10：51：47', '2019-08-12 18：03：20'],
    //     ['大毛', '15888882222', '10%', '10', '100', '11000', '10000', '1000', '已付', '现金', '2019-08-07 10：51：17', '2019-08-12 18：03：20'],
    //     ['小毛', '15888884444', '7%', '1000', '10', '10700', '10000', '700', '已付', '刷卡', '2019-08-07 10：51：17', '2019-08-12 18：03：20'],
    // ];

    let arrayData = [

    ]

    // 将数据转成workSheet
    let arrayWorkSheet = xlsx.utils.aoa_to_sheet(arrayData);
    // let jsonWorkSheet = xlsx.utils.json_to_sheet(jsonData);

    // 构造workBook
    let workBook = {
        SheetNames: ['arrayWorkSheet'],
        Sheets: {
            'arrayWorkSheet': arrayWorkSheet
        },
    };
    let worksheet = workBook.Sheets['arrayWorkSheet'];　　　　 // 尺寸

    // 将workBook写入文件
    // xlsx.writeFile(workBook, path.resolve(__dirname, "../public/aa.xlsx"));
    xlsx.writeFile(workBook, "./excel/aa.xlsx");
    return arrayWorkSheet
