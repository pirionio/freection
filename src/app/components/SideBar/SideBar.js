const React = require('react')
const {Component, PropTypes} = React
const {Link} = require('react-router')
const radium = require('radium')

const Flexbox = require('../UI/Flexbox')
const vars = require('../style-vars')

class SideBar extends Component {
    render() {
        const navStyle = {
            backgroundColor: vars.primaryColor
        }

        const linkStyle = {
            textTransform: 'uppercase',
            textDecoration: 'none',
            color: vars.menuTextColor,
            display: 'block',
            marginBottom: 38,

            ':visited': {
                color: vars.menuTextColor
            }
        }

        const activeLinkStyle = {
            'color': 'white'
        }

        return (
            <Flexbox grow={0} shrink={0} width='222px' height='100%' style={navStyle}>
                <div style={{paddingTop: 34, paddingLeft: 27}}>
                    <Link to="/whatsnew" style={linkStyle} activeStyle={activeLinkStyle}>What's New?</Link>
                    <Link to="/todo" style={linkStyle} activeStyle={activeLinkStyle}>To Do</Link>
                    <Link to="/followup" style={linkStyle} activeStyle={activeLinkStyle}>Follow Up</Link>
                    <Link to="/emails/unread" style={linkStyle} activeStyle={activeLinkStyle}>Unread Emails</Link>
                    <Link to="/integrations/github" style={linkStyle}  activeStyle={activeLinkStyle}>Github</Link>
                </div>
            </Flexbox>
        )
    }
}

module.exports = radium(SideBar)