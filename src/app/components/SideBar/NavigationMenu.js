const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const Link = require('../UI/Link')
const radium = require('radium')
const classAutobind = require('class-autobind').default

const Flexbox = require('../UI/Flexbox')
const styleVars = require('../style-vars')

class NavigationMenu extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, NavigationMenu.prototype)
    }

    getLink({pathname, title}) {
        const styles = this.getStyles()

        return (
            <div name="link-box" style={styles.linkBox} key={pathname}>
                <Link to={pathname} style={styles.link} activeStyle={styles.link.active}>
                    {title}
                    {window.location.pathname.startsWith(pathname) && <span style={styles.arrow}></span>}
                </Link>
            </div>
        )
    }

    getStyles() {
        return {
            menu: {
                paddingTop: 34,
                paddingLeft: 27
            },
            linkBox: {
                height: '12px',
                marginBottom: '40px',
                position: 'relative'
            },
            link: {
                fontFamily: 'Roboto Mono, monospace',
                fontSize: '0.857em',
                fontWeight: 500,
                color: styleVars.menuTextColor,
                textTransform: 'uppercase',
                textDecoration: 'none',
                letterSpacing: '0.05em',
                ':hover': {
                    color: styleVars.highlightColor
                },
                active: {
                    color: 'white'
                }
            },
            arrow: {
                position: 'absolute',
                right: 0,
                top: 3,
                width: 0,
                height: 0,
                borderTop: '5px solid transparent',
                borderBottom: '5px solid transparent',
                borderRight: `6px solid ${styleVars.backgroundColor}`
            }
        }
    }

    render() {
        const styles = this.getStyles()

        const links = [
            {
                pathname: '/whatsnew',
                title: 'What\'s New'
            },
            {
                pathname: '/todo',
                title: 'To Do'
            },
            {
                pathname: '/followup',
                title: 'Follow Up'
            }
        ].map(this.getLink)

        return (
            <Flexbox name="navigation-menu-container" grow={1} style={styles.menu}>
                {links}
            </Flexbox>
        )
    }
}

NavigationMenu.propTypes = {
    routing: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        routing: state.routing
    }
}

module.exports = connect(mapStateToProps)(radium(NavigationMenu))