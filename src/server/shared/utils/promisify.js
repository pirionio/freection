function promisifyMethod(method, obj) {
    return function() {
        const args = []

        for (const arg of arguments) {
            args.push(arg)
        }

        return new Promise(function(resolve, reject) {
            args.push(function(err, result) {
                if (err)
                    reject(err)
                else
                    resolve(result)
            })

            method.apply(obj, args);
        })
    }
}

export default function promisify(obj, methods) {
    for (const methodName of methods) {
        const method = obj[methodName]

        if (method) {
            obj[`${methodName}Async`] = promisifyMethod(method, obj)
        }
    }

    return obj
}
