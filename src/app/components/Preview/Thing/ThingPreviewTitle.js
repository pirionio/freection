const React = require('react')
const {connect} = require('react-redux')

const ThingPageActions = require('../../../actions/thing-page-actions')

const ThingPreviewTitle = ({thing, dispatch}) => {
    return <a onClick={() => dispatch(ThingPageActions.show(thing.id)) }>{thing.subject}</a>
}

module.exports = connect()(ThingPreviewTitle)
