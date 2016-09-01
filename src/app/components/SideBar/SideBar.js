const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const classAutobind = require('class-autobind').default
const useSheet = require('react-jss').default

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

    render() {
        const {config} = this.props
        const {classes} = this.props.sheet

        return (
            <Flexbox name="side-bar" shrink={0} container="column" className={classes.sideBar}>
                <Flexbox name="logo-container" container="row" justifyContent="center" alignItems="center" className={classes.logoContainer}>
                    <img src={logo} className={classes.logoImage} />
                </Flexbox>
                <NavigationMenu />
                {config.isDemo ? <BoardList /> : null}
                <UserSettings />
            </Flexbox>
        )
    }
}

const styles = {
    sideBar: {
        width: 222,
        height: '100%',
        backgroundColor: styleVars.primaryColor
    },
    logoContainer: {
        width: 185,
        height: 75,
        borderBottom: {
            width: 1,
            style: 'solid',
            color: '#232e34'
        },
        margin: [0, 19]
    },
    logoImage: {
        width: 45,
        height: 15
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

module.exports = useSheet(connect(mapStateToProps)(SideBar), styles)