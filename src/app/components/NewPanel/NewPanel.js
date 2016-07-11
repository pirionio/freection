const React = require('react')
const {Component} = React

class NewPanel extends Component {
    render () {
        return (
            <div className="new-panel">
                <div className="text-section">
                    <textarea className="message-text" tabIndex="1" placeholder="message" />
                    <input className="message-subject" tabIndex="2" placeholder="subject" />
                </div>
                <div className="send-section">
                    <button onClick="">Send</button>
                </div>
            </div>
        )
    }
}

NewPanel.propTypes = {
}

module.exports = NewPanel