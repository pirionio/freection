const React = require('react')
const {Component} = React

const Flexbox = require('../UI/Flexbox')
const styleVars = require('../style-vars')

const Logo = require('../../static/logo-white.png')

class LoginTopBar extends Component {
    constructor(props) {
        super(props)
    }

    getStyles() {
        return {
            topBar: {
                height: '75px',
                padding: '0 47px 0 55px',
                backgroundColor: styleVars.secondaryColor,
                color: 'white'
            },
            image: {
                width: '90px',
                height: '30px'
            }
        }
    }

    render () {
        const styles = this.getStyles()

        return (
            <Flexbox name="top-bar" shrink={0} container="row" justifyContent="center" alignItems="center" style={styles.topBar}>
                <img src={Logo} style={styles.image} />
            </Flexbox>
        )
    }
}

module.exports = LoginTopBar