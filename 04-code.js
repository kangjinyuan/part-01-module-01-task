// 四.手写实现Promise源码
// 要求：尽可能还原Promise中的每一个API，并通过注释的方式描述思路和原理

//等待状态
const PENDING = 'pending'
//成功状态
const FULFILLED = 'fulfilled'
//失败状态
const REJECTED = 'rejected'

class MyPromise {

    //构造函数，传入一个执行器，创建Promise对象时，执行器立即执行
    constructor(executor) {
        //对构造函数进行容错处理
        try {
            executor(this.resolve, this.reject)
        } catch (e) {
            this.reject(e)
        }
    }

    //Promise对象的状态属性，默认是等待状态
    status = PENDING
    //成功之后的值，默认是undefined
    value = undefined
    //失败之后的值，默认是undefined
    error = undefined
    //成功执行的回调函数组
    successCallback = []
    //失败执行的回调函数组
    failCallback = []

    resolve = value => {
        //如果状态不是PENDING，resolve方法结束
        if (this.status != PENDING) {
            return
        }
        //改变status状态
        this.status = FULFILLED
        //给value赋值
        this.value = value
        //执行成功之后的回调函数
        while (this.successCallback.length) {
            this.successCallback.shift()(value)
        }
    }

    reject = error => {
        //如果状态不是PENDING，reslove方法结束
        if (this.status != PENDING) {
            return
        }
        //改变status状态
        this.status = REJECTED
        //给value赋值
        this.error = error
        //执行成功之后的回调函数
        while (this.failCallback.length) {
            this.failCallback.shift()(error)
        }
    }

    then(successCallback, failCallback) {
        //判断成功回调函数是不是传入，如果传入赋值为本身，如果没传入，自定义一个函数
        successCallback = successCallback ? successCallback : value => value
        //判断失败回调函数是不是传入，如果传入赋值为本身，如果没传入，抛出一个错误
        failCallback = failCallback ? failCallback : error => { throw error }
        //创建一个Promise对象promise2
        let promise2 = new MyPromise((resolve, reject) => {
            if (this.status === FULFILLED) {
                //让成功回调函数延迟调用
                setTimeout(() => {
                    //对成功函数进行容错处理
                    try {
                        let x = successCallback(this.value)
                        //判断x是普通值还是Promise对象，如果是普通值，直接resolve，如果是Promsie对象，调用then方法，根据返回结果决定reslove还是reject
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            } else if (this.status === REJECTED) {
                //让失败回调函数延迟调用
                setTimeout(() => {
                    //对失败函数进行容错处理
                    try {
                        let x = failCallback(this.error)
                        //判断x是普通值还是Promise对象，如果是普通值，直接resolve，如果是Promsie对象，调用then方法，根据返回结果决定reslove还是reject
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            } else {
                //将成功函数缓存下来
                this.successCallback.push(() => {
                    //让成功回调函数延迟调用
                    setTimeout(() => {
                        //对成功函数进行容错处理
                        try {
                            let x = successCallback(this.value)
                            //判断x是普通值还是Promise对象，如果是普通值，直接resolve，如果是Promsie对象，调用then方法，根据返回结果决定reslove还是reject
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                })
                this.failCallback.push(() => {
                    //让失败回调函数延迟调用
                    setTimeout(() => {
                        //对失败函数进行容错处理
                        try {
                            let x = failCallback(this.error)
                            //判断x是普通值还是Promise对象，如果是普通值，直接resolve，如果是Promsie对象，调用then方法，根据返回结果决定reslove还是reject
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                })
            }
        })
        return promise2
    }

    catch(failCallback) {
        return this.then(undefined, failCallback)
    }

    finally(callback) {
        return this.then(value => {
            return MyPromise.resolve(callback()).then(() => value)
        }, error => {
            return MyPromise.resolve(callback()).then(() => { throw error })
        })
    }

    static all(array) {
        //返回结果数组
        let result = []
        //函数执行索引
        let index = 0
        //返回一个新的Promise对象
        return new MyPromise((resolve, reject) => {
            function addData(key, value) {
                result[key] = value
                index++
                if (index === array.length) {
                    resolve(result)
                }
            }
            //循环执行任务
            for (let i = 0; i < array.length; i++) {
                //当前任务
                let current = array[i]
                //判断当前任务是否属于Promise对象，如果是Promise对象，调用then方法，如果是普通值，直接添加到返回结果
                if (current instanceof MyPromise) {
                    current.then(value => addData(i, value), error => reject(error))
                } else {
                    addData(i, current)
                }
            }
        })
    }

    static resolve(value) {
        //判断value是否是Promsie对象，如果是直接返回，如果不是，创建一个Promise对象，将value resolve出去
        if (value instanceof MyPromise) {
            return value
        } else {
            return new MyPromise(resolve => {
                resolve(value)
            })
        }
    }

}

function resolvePromise(promise2, x, resolve, reject) {
    //如果当前函数的返回值等于返回的Peomise对象，则抛出一个错误
    if (promise2 === x) {
        return reject(new Error('Chaining cycle detected for promise #<Promise>'))
    }
    //判断x是否属于Promise对象，如果是Promise对象，调用then方法，如果是普通值，直接resolve
    if (x instanceof MyPromise) {
        //Promise对象
        x.then(resolve, reject)
    } else {
        //普通值
        resolve(x)
    }
}

module.exports = MyPromise