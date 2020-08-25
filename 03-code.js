// 三.基于下面提供的代码(support.js)，完成后续的练习

const { Container, Maybe } = require('./support')
const fp = require('lodash/fp')

//练习1：使用fp.add(x,y)和fp.map(f,x)创建一个能让functor里的值增加的函数ex1

let maybe = Maybe.of([5, 6, 11])

let ex1 = () => {
    return fp.map(value => fp.add(value, 10))
}

let maybe2 = maybe.map(ex1())._value

console.log(maybe2)

//练习2：实现一个函数ex2，能够使用fp.first获取列表的第一个元素

let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])

let ex2 = () => {
    return fp.first
}

let xs2 = xs.map(ex2())._value

console.log(xs2)

//练习3：实现一个函数ex3，使用safeProp和fp.first找到user的名字的首字母

let safeProp = fp.curry(function (x, o) {
    return Maybe.of(o[x])
})

let user = { id: 2, name: 'Albert' }

let ex3 = () => {
    return fp.first
}

let userNameFirstLetter = safeProp('name', user).map(ex3())._value

console.log(userNameFirstLetter)

//使用Maybe重写ex4，不要有if语句

// let ex4 = function(n){
//     if(n){
//         return parseInt(n)
//     }
// }

let ex4 = (n) => {
    let r = Maybe.of(n)
    return r.map(parseInt)._value
}

console.log(ex4(5.5))

