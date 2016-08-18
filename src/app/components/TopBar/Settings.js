const React = require('react')
const {Component} = React
const classAutobind = require('class-autobind').default
const clickOutside = require('react-click-outside')

const Flexbox = require('../UI/Flexbox')
const Icon = require('react-fontawesome')
const Link = require('../UI/Link')
const styleVars = require('../style-vars')

class Settings extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, Settings.prototype)
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
            </Flexbox>
        ) : null
    }

    getStyles() {
        return {
            settings: {
                position: 'relative',
            },
            button: {
                marginTop: '2px',
                marginRight: '10px',
                fontSize: '1.2em',
                cursor: 'pointer'
            },
            menu: {
                position: 'absolute',
                bottom: '-60px',
                left: '-62px',
                minHeight: '50px',
                minWidth: '130px',
                backgroundColor: styleVars.dropdownBackgroundColor,
                border: `1px solid ${styleVars.dropdownBorderColor}`
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
                left: '64px',
                top: '-6px',
                width: 0,
                height: 0,
                borderRight: '5px solid transparent',
                borderLeft: '5px solid transparent',
                borderBottom: `6px solid ${styleVars.dropdownBackgroundColor}`
            }
        }
    }

    render() {
        const menu = this.getSettingMenu()
        const styles = this.getStyles()

        return (
            <Flexbox name="settings-container" style={styles.settings}>
                <Icon name="cog" onClick={this.toggleSettingsMenu} style={styles.button} />
                {menu}
            </Flexbox>
        )
    }
}

Settings.propTypes = {}

module.exports = clickOutside(Settings)