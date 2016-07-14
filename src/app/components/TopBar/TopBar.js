const React = require('react')
const {Component} = React

const UserInfo = require('./UserInfo')

class TopBar extends Component {
    render () {
        return (
            <div className="top-bar">
                <span className="title">
                    Freection
                </span>
                <UserInfo />
            </div>
        )
    }
}

TopBar.propTypes = {
}

module.exports = TopBar