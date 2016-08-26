const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const classAutobind = require('class-autobind').default

const Flexbox = require('../UI/Flexbox')
const styleVars = require('../style-vars')

const NavigationMenu = require('./NavigationMenu')
const UserSettings = require('./UserSettings')
const BoardList = require('./BoardList')

const logo = require('../../static/logo-white.png')

class SideBar extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, SideBar.prototype)
    }

    getStyles() {
        return {
            sideBar: {
                width: '222px',
                height: '100%',
                backgroundColor: styleVars.primaryColor
            },
            logo: {
                container: {
                    width: '185px',
                    height: '75px',
                    borderBottom: '1px solid #232e34',
                    margin: '0 19px'
                },
                image: {
                    width: '45px',
                    height: '15px'
                }
            }
        }
    }

    render() {
        const {config} = this.props
        const styles = this.getStyles()

        return (
            <Flexbox name="side-bar" shrink={0} container="column" style={styles.sideBar}>
                <Flexbox name="logo-container" container="row" justifyContent="center" alignItems="center" style={styles.logo.container}>
                    <img src={logo} style={styles.logo.image} />
                </Flexbox>
                <NavigationMenu />
                {config.isDemo ? <BoardList /> : null}
                <UserSettings />
            </Flexbox>
        )
    }
}

SideBar.propTypes = {
    config: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        config: state.config
    }
}

module.exports = connect(mapStateToProps)(SideBar)