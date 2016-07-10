const React = require('react')
const {Component, PropTypes} = React
const NewThing = require('../Thing/NewThing')

class WhatsNew extends Component {
    render () {
        const {things} = this.props
        const rows = things.map(thing => <NewThing thing={thing} key={thing.id} />)
        return (
            <div className="whats-new">
                {rows}
            </div>
        )
    }
}

WhatsNew.propTypes = {
    things: PropTypes.array.isRequired
}

module.exports = WhatsNew