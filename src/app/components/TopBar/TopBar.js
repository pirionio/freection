const React = require('react')
const {Component} = React

class TopBar extends Component {
    render () {
        return (
            <div className="top-bar">
                <span className="title">
                    Freection
                </span>
            </div>
        )
    }
}

TopBar.propTypes = {
}

module.exports = TopBar