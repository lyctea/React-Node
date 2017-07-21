// /**
//  * 这个例子中,如果定时器中的是普通函数，那么this将会指向全局作用域，
//  * 但是箭头函数的话，总是指向函数所在的对象，也就是foo
//  */
// function foo() {
//     setTimeout(() => {
//         console.log('id:', this.id)
//     }, 100)
// }

// foo.call({ id: 42 })  //id: 42

// /**
//  * 这里只有一个this 也就是函数f的this，因为其他函数都是箭头函数，都没有自己的this
//  * 注意，还有其他三个变量在箭头函数中也是不存在的。arguments, super, new.target
//  * 所以，在箭头函数中call() apply() bind() 方法也是不能再用，因为这些都是改变this的方法，而在
//  * 箭头函数中没有this
//  */
// function f() {
//     return () => {
//         return () => {
//             return () => {
//                 console.log('other id:', this.id)
//             }
//         }
//     }
// }

// f.call({ id: 52 })()()()  //other id: 52

// var adder = {
//     base: 1,
//     add: function (a) {
//         var f = v => v + this.base 
//         return f(a)
//     },
//     addThruCall: function (a) {
//         var f = v => v + this.base
//         var b = { base: 2 }
//         return f.call(b, a)
        
//     }
// }
// console.log(adder.add(1))  //2
// console.log(adder.addThruCall(1))  //2

/**
 * Object.defineProperty() 方法会直接在一个对象上定义一个新属性，
 * 或者修改一个对象的现有属性， 并返回这个对象。
 */
var obj = { a: 10 }
Object.defineProperty(obj, 'b', {
    /**
     * 函数体内的this对象就是定义时所在的对象，而不是使用时所在的对象。
     */
    get: () => {
        console.log(this.a, typeof this.a, this)  //undefined 'undefined' {}
        return this.a + 0  //undefined
    }
})

console.log(obj.b.get)

// var Foo = () => {};
// var foo = new Foo();
// TypeError: Foo is not a constructor