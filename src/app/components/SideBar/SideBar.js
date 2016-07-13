const React = require('react')
const {Component, PropTypes} = React
const {Link} = require('react-router')

class SideBar extends Component {
    render() {
        return (
            <div className="side-bar">
                <Link to="/whatsnew" className="side-bar-link">What's New?</Link>
                <Link to="/todo" className="side-bar-link">To Do</Link>
                <Link to="/followup" className="side-bar-link">Follow Up</Link>
            </div>
        )
    }
}

module.exports = SideBar