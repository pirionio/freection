const React = require('react')
const {Component, PropTypes} = React
const {Link} = require('react-router')

class SideBar extends Component {
    render() {
        return (
            <div className="side-bar">
                <Link to="/whatsnew" className="side-bar-link" activeClassName="active">What's New?</Link>
                <Link to="/todo" className="side-bar-link" activeClassName="active">To Do</Link>
                <Link to="/followup" className="side-bar-link" activeClassName="active">Follow Up</Link>
                <Link to="/emails/unread" className="side-bar-link" activeClassName="active">Unread Emails</Link>
            </div>
        )
    }
}

module.exports = SideBar