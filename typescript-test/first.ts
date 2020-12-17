var myName = "Zhang San";

var getName = function() {
    return "zhangsan"
}

console.log(`hello ${myName}`);
console.log(`hello ${getName()}`);


let myName1: string = "zhang san";

myName1 = '12';

function fun1 (...args) {
    args.forEach(function (arg) {
        console.log(arg);
    })
}

function* doSomething() {
    console.log('start');

    yield;

    console.log('end');
}

function getStock() {
    return {
        code: "IBM",
        price: 100,
        name: {
            name1: 'zhanagsan',
            name2: 'lisi'
        }
    }
}

// js
var stock = getStock();
var code = stock.code;
var price = stock.price;

// ts
var {code, price} = getStock();
var {code: codex, price, name: {name2}} = getStock();