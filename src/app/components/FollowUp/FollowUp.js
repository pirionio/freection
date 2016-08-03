const React = require('react')
const {Component, PropTypes} = React
const DocumentTitle = require('react-document-title')
const {connect} = require('react-redux')
const sortBy = require('lodash/sortBy')

const PreviewsContainer = require('../Preview/PreviewsContainer')
const FollowUpsActions = require('../../actions/follow-up-actions')
const FollowUpPreviewItem = require('./FollowUpPreviewItem')

class FollowUp extends Component {
    constructor(props) {
        super(props)
        this.getThingsToFollowUp = this.getThingsToFollowUp.bind(this)
    }

    getThingsToFollowUp() {
        return sortBy(this.props.things, 'createdAt').map(thing =>
            <FollowUpPreviewItem thing={thing} key={thing.id} />)
    }

    getTitle() {
        if (this.props.things.length > 0)
            return `Freection (${this.props.things.length}) - Follow Up`
        else
            return 'Freection - Follow Up'
    }

    render() {
        return (
            <DocumentTitle title={this.getTitle()}>
                <PreviewsContainer previewItems={this.getThingsToFollowUp()}
                                   fetchPreviews={this.props.fetchFollowUps}
                                   noPreviewsText="There are no things to follow up" />
            </DocumentTitle>
        )
    }
}

FollowUp.propTypes = {
    things: PropTypes.array.isRequired
}

const mapStateToProps = (state) => {
    return {
        things: state.followUps.followUps
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchFollowUps: () => dispatch(FollowUpsActions.fetchFollowUps())
    }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(FollowUp)