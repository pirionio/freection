const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const classAutobind = require('class-autobind').default
const useSheet = require('react-jss').default

const Flexbox = require('../UI/Flexbox')
const SettingsMenu = require('./SettingsMenu')

class UserSettings extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, UserSettings.prototype)
    }

    render() {
        const {currentUser, sheet: {classes}} = this.props
        return (
            <Flexbox name="settings" container="row" justifyContent="space-around" alignItems="center" className={classes.settings}>
                <span className={classes.user}>{currentUser.firstName}</span>
                <SettingsMenu />
            </Flexbox>
        )
    }
}

const style = {
    settings: {
        height: 74,
        width: 185,
        margin: [0, 19],
        borderTop: '1px solid #232e34',
        color: 'white'
    },
    user: {
        letterSpacing: '0.1em'
    }
}

UserSettings.propTypes = {
    currentUser: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        currentUser: state.auth
    }
}

module.exports = useSheet(connect(mapStateToProps)(UserSettings), style)