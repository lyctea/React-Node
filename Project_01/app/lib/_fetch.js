const _fetch = (fetch_promise, timeout) => {
    let abort_fn = null;

    //这是一个可以被reject的promise
    let abort_promise = new Promise(function(resolve, reject) {
        abort_fn = function() {
            reject('timeout');
            // alert('超时')
        };
    });

    //这里使用Promise.race，以最快 resolve 或 reject 的结果来传入后续绑定的回调
    let abortable_promise = Promise.race([
        fetch_promise,
        abort_promise
    ]);

    setTimeout(function() {
        abort_fn();
    }, timeout);

    return abortable_promise;
}

export default _fetch;
