const React = require('react')
const {Component} = React
const useSheet = require('react-jss').default

const Flexbox = require('../UI/Flexbox')
const styleVars = require('../style-vars')

const Logo = require('../../static/logo-text-white.png')

class LoginTopBar extends Component {
    constructor(props) {
        super(props)
    }

    render () {
        const {sheet: {classes}} = this.props
        return (
            <Flexbox name="top-bar" shrink={0} container="row" justifyContent="center" alignItems="center" className={classes.topBar}>
                <img src={Logo} className={classes.image} />
            </Flexbox>
        )
    }
}

const style = {
    topBar: {
        height: 75,
        padding: [0, 47, 0, 55],
        backgroundColor: styleVars.secondaryColor,
        color: 'white'
    },
    image: {
        width: 412,
        height: 30
    }
}

module.exports = useSheet(LoginTopBar, style)