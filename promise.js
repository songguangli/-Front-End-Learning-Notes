const { resolve } = require("node:path")

// 串行方式
var p = function() {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            console.log('1000')
            resolve()
        }, 1000)
    })
}
var p1 = function() {
    return new Promise(function (resolve, reject){
        setTimeout(() => {
            console.log('2000');
            resolve()
        }, 2000)
    })
}
var p2 = function() {
    return new Promise (function (resolve, reject) {
        setTimeout(() => {
            console.log('3000');
            resolve()
        }, 3000)
    })
}

p().then(() => {
    return p1()
}).then(() => {
    return p2()
}).then(() => {
    console.log('end');
})


// 并行
Promise.all(promises: [].then(fun: function))
Promise.all 可以保证，promises 数组中所有 promise 对象都达到 resolve 状态，才执行 then 回调

// 实现
var promises = function() {
    return [1000, 2000, 3000].map(current => {
        return new Promise(funtion (resolve, reject) {
            setTimeout(() => {
                console.log(current);
            }, current)
        })
    })
}

Promise.all(promises()).then(() => {
    console.log('end');
})


// Promise.all 并发限制
function multiRequest(urls = [], maxNum) {
    // 请求总数量
    const len = urls.length;
    // 根据请求数量创建一个数组来保存请求的结果
    const result = new Array(len).fill(false);
    // 当前完成的数量
    let count = 0;

    return new Promise((resolve, reject) => {
        // 请求maxNum个
        while (count < maxNum) {
            next();
        }
        function next() {
            let current = count++;
            // 处理边界条件
            if (current >= len) {
                // 请求全部完成就将promise置为成功状态, 然后将result作为promise值返回
                !result.includes(false) && resolve(result);
                return;
            }
            const url = urls[current];
            console.log(`开始 ${current}`, new Date().toLocaleString());
            fetch(url)
                .then((res) => {
                    // 保存请求结果
                    result[current] = res;
                    console.log(`完成 ${current}`, new Date().toLocaleString());
                    // 请求没有全部完成, 就递归
                    if (current < len) {
                        next();
                    }
                })
                .catch((err) => {
                    console.log(`结束 ${current}`, new Date().toLocaleString());
                    result[current] = err;
                    // 请求没有全部完成, 就递归
                    if (current < len) {
                        next();
                    }
                });
        }
    });
}