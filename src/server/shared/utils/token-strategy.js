import jwt from 'jsonwebtoken'
import Strategy from 'passport-strategy'

class TokenStrategy extends Strategy {
    constructor() {
        super()
        this.name = 'token'
    }

    authenticate(req, options) {
        let token = null

        if (options.cookie && req && req.cookies)
            token = req.cookies['token']

        if (options.query && !token && req && req.query)
            token = req.query.token

        if (!token)
            this.pass()
        else {
            jwt.verify(token, options.secret, (err, decoded) => {
                if (err) {
                    this.pass()
                }
                else {
                    const property = req._passport.instance._userProperty || 'user'
                    req[property] = decoded
                    this.pass()
                }
            })
        }
    }
}

class Token {

    constructor() {
        this._options = {}
    }

    /**
     * Middleware that will authenticate a request using token strategy.
     * Alternative to passport default session strategy.
     * This will serialize the user to a signed token and save it as cookie.
     * Token can also be provided as query string param named `token`.
     * cookie-parser must be configured.
     *
     * Options:
     *   - `secret`           Required, the secret used to sign the token.
     *   - `cookie`           Should the token be taken from cookie, default to true.
     *   - `query`            Should the token be taken from query, default to true.
     *   - `expiresIn`        Lifetime of token, expressed in seconds or a string describing a time span rauchg/ms. Eg: 60, "2 days", "10h", "7d"
     *
     * @param {Object} options
     * @return {Function} middleware
     * @api public
     */
    initialize(passport, options) {
        if (!options.secret) {
            throw new TypeError('initialize requires a secret')
        }

        if (options.cookie === undefined)
            options.cookie = true

        if (options.query === undefined)
            options.query = true

        this._options = options
        const copy = Object.assign({session:false}, options)
        passport.use(new TokenStrategy())

        return passport.authenticate('token', copy)
    }

    /**
     * Middleware that will set take user,create a token and set the token cookie.
     * Use this middleware after authenticate with another strategy, like basic or facebook.
     *
     * Options:
     *  - `redirect`    After login, redirect to given url
     *  - `send`        After login send a response with the token as string
     *
     * @param options
     * @returns {Function}
     * @api public
     */
    login(options) {
        if (!options)
            options = {}

        return (req, res, next) => {
            const secret = this._options.secret

            const user = req.user
            if (!user)
                throw new Error('No user is set')

            jwt.sign(user, secret, {expiresIn: options.expiresIn}, (err,token) => {
                if (this._options.cookie)
                    res.cookie('token', token, {httpOnly: true})

                if (options.redirect)
                    res.redirect(options.redirect)
                else if (options.send)
                    res.send(token)
                else
                    next()
            })
        }
    }

    /**
     * Middleware that will clear the token cookie and logout the user.
     *
     * Options:
     *  - `redirect`    After logout, redirect to given url
     *
     * @param options
     * @returns {Function}
     * @api public
     */
    logout(options) {
        return function (req, res, next) {
            req.logout()
            res.clearCookie('token')

            if (options.redirect)
                res.redirect(options.redirect)
            else
                next()
        }
    }

    /**
     * Middleware that will check if the user is authenticated.
     *
     * Options:
     *   - `successRedirect`  If authenticated, redirect to given URL
     *   - `failureRedirect`  If not authenticated, redirect to given URL
     *
     * @param options
     * @constructor
     */
    auth(options) {
        return function(req, res, next) {
            if (req.isAuthenticated()) {
                if (options && options.successRedirect)
                    res.redirect(options.successRedirect)
                else
                    next()
            }
            else {
                if (options && options.failureRedirect)
                    res.redirect(options.failureRedirect)
                else
                    res.sendStatus(401)
            }
        }
    }
}


/**
 * Expose classes.
 */
export {
    Token,
    TokenStrategy as Strategy
}

/**
 * Export default singleton.
 *
 * @api public
 */
export default new Token()
