const React = require('react')
const {Component, PropTypes} = React
const radium = require('radium')
const classAutobind = require('class-autobind').default

const Link = require('../UI/Link')
const Flexbox = require('../UI/Flexbox')
const styleVars = require('../style-vars')

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
            menu: {
                paddingTop: 10,
                paddingLeft: 27
            },
            linkBox: {
                display: 'block',
                position: 'relative',
                marginBottom: 42
            },
            link: {
                fontFamily: 'Roboto Mono, monospace',
                fontSize: '0.857em',
                lineHeight:'4.167',
                fontWeight: 500,
                color: styleVars.menuTextColor,
                textTransform: 'uppercase',
                textDecoration: 'none',
                ':hover': {
                    color: styleVars.highlightColor
                },
                active: {
                    color: 'white'
                }
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
            },
            arrow: {
                position: 'absolute',
                right: 0,
                top: 21,
                width: 0,
                height: 0,
                borderTop: '5px solid transparent',
                borderBottom: '5px solid transparent',
                borderRight: `6px solid ${styleVars.backgroundColor}`
            }
        }
    }

    getLink({pathname, title}) {
        const styles = this.getStyles()

        return (
            <div name="link-box" style={styles.linkBox} key={pathname}>
                <Link to={pathname} style={styles.link} activeStyle={styles.link.active}>
                    {title}
                    {window.location.pathname === pathname && <span style={styles.arrow}></span>}
                </Link>
            </div>
        )
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
            },
            {
                pathname: '/emails/unread',
                title: 'Unread Emails'
            },
            {
                pathname: '/integrations/github',
                title: 'Github'
            }
        ].map(this.getLink)

        return (
            <Flexbox name="side-bar" shrink={0} container="column" style={styles.sideBar}>
                <Flexbox name="logo-container" container="row" justifyContent="center" alignItems="center" style={styles.logo.container}>
                    <img src={logo} style={styles.logo.image} />
                </Flexbox>
                <Flexbox name="menu-container" grow={1} style={styles.menu}>
                    {links}
                </Flexbox>
            </Flexbox>
        )
    }
}

module.exports = radium(SideBar)