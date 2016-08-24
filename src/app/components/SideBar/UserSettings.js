const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const classAutobind = require('class-autobind').default

const Flexbox = require('../UI/Flexbox')
const SettingsMenu = require('./SettingsMenu')

class UserSettings extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, UserSettings.prototype)
    }

    getStyles() {
        return {
            settings: {
                height: '74px',
                width: '185px',
                margin: '0 19px',
                borderTop: '1px solid #232e34',
                color: 'white',
                user: {
                    letterSpacing: '0.1em'
                }
            }
        }
    }

    render() {
        const {currentUser} = this.props
        const styles = this.getStyles()
        return (
            <Flexbox name="settings" container="row" justifyContent="space-around" alignItems="center" style={styles.settings}>
                <span style={styles.settings.user}>{currentUser.firstName}</span>
                <SettingsMenu />
            </Flexbox>
        )
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

module.exports = connect(mapStateToProps)(UserSettings)