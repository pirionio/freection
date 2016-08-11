const React = require('react')
const {Component} = React

const UserInfo = require('./UserInfo')

const Flexbox = require('../UI/Flexbox')
const styleVars = require('../style-vars')

class TopBar extends Component {
    getStyle() {
        return {
            topBar: {
                height: '75px',
                padding: '30px 47px 30px 55px',
                backgroundColor: styleVars.secondaryColor,
                color: 'white'
            }
        }
    }

    render () {
        const styles = this.getStyle()
        return (
            <Flexbox name="top-bar" container="row" justifyContent="flex-end" alignItems="center" style={styles.topBar}>
                <UserInfo />
            </Flexbox>
        )
    }
}

TopBar.propTypes = {
}

module.exports = TopBar