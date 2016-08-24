const React = require('react')
const {Component} = React
const classAutobind = require('class-autobind').default
const clickOutside = require('react-click-outside')

const Flexbox = require('../UI/Flexbox')
const Icon = require('react-fontawesome')
const Link = require('../UI/Link')
const styleVars = require('../style-vars')

class SettingsMenu extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, SettingsMenu.prototype)
    }

    componentWillMount() {
        this.setState({showMenu: false})
    }

    handleClickOutside() {
        this.closeSettingsMenu()
    }

    toggleSettingsMenu() {
        this.setState({showMenu: !this.state.showMenu})
    }

    closeSettingsMenu() {
        this.setState({showMenu: false})
    }

    getSettingMenu() {
        const styles = this.getStyles()
        return this.state.showMenu ? (
            <Flexbox name="settings-menu" grow={1} container="column" alignItems="center" style={styles.menu}>
                <span style={styles.arrow} />
                <Link to="/integrations" style={styles.menuOption} onClick={this.closeSettingsMenu}>Integrations</Link>
                <a href="/login/logout" style={styles.menuOption}>Logout</a>
            </Flexbox>
        ) : null
    }

    getStyles() {
        return {
            settings: {
                position: 'relative',
            },
            button: {
                marginRight: '10px',
                fontSize: '0.9em',
                cursor: 'pointer'
            },
            menu: {
                position: 'absolute',
                top: '-120px',
                left: '-62px',
                minHeight: '50px',
                minWidth: '130px',
                backgroundColor: styleVars.secondaryBackgroundColor,
                border: `1px solid ${styleVars.baseBorderColor}`
            },
            menuOption: {
                width: '100%',
                padding: '17px',
                textAlign: 'center',
                cursor: 'pointer',
                color: 'black',
                textDecoration: 'none',
                ':hover': {
                    backgroundColor: '#ebe9e9'
                }
            },
            arrow: {
                position: 'absolute',
                left: '63px',
                bottom: '-6px',
                width: 0,
                height: 0,
                borderRight: '5px solid transparent',
                borderLeft: '5px solid transparent',
                borderTop: `6px solid ${styleVars.secondaryBackgroundColor}`
            }
        }
    }

    render() {
        const menu = this.getSettingMenu()
        const styles = this.getStyles()

        return (
            <Flexbox name="settings-container" style={styles.settings}>
                <Icon name="chevron-down" onClick={this.toggleSettingsMenu} style={styles.button} />
                {menu}
            </Flexbox>
        )
    }
}

SettingsMenu.propTypes = {}

module.exports = clickOutside(SettingsMenu)