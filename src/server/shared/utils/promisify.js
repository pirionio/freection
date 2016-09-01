function promisifyMethod(method, obj) {
    return function(...args) {

        return new Promise((resolve, reject) => {
            const callback = (err, result) => {
                if (err)
                    reject(err)
                else
                    resolve(result)
            }

            method.apply(obj, [...args, callback])
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
