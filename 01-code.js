// 一.将下面异步代码使用Promise的方式改进
// setTimeout(function(){
//     var a = 'hello'
//     setTimeout(function(){
//         var b = 'lagou'
//         setTimeout(function(){
//             var c = 'I ❤ U'
//             console.log(a + b +c)
//         },1000)
//     },1000)
// },1000)

const task1 = () => {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve('hello')
        }, 10)
    })
}

const task2 = () => {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve('lagou')
        }, 10)
    })
}

const task3 = () => {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve('I ❤ U')
        }, 10)
    })
}

Promise.all([task1(), task2(), task3()]).then(res => {
    let result = res.join(' ')
    console.log(result)
})