const React = require('react')
const {Component, PropTypes} = React
const DocumentTitle = require('react-document-title')
const {connect} = require('react-redux')
const sortBy = require('lodash/sortBy')
const classAutobind = require('class-autobind').default

const PreviewsContainer = require('../Preview/PreviewsContainer')
const FollowUpsActions = require('../../actions/follow-up-actions')
const FollowUpPreviewItem = require('./FollowUpPreviewItem')

class FollowUp extends Component {
    constructor(props) {
        super(props)
        classAutobind(this)
    }

    fetchFollowUps() {
        const {dispatch} = this.props
        dispatch(FollowUpsActions.fetchFollowUps())
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
        const {invalidationStatus} = this.props

        return (
            <DocumentTitle title={this.getTitle()}>
                <PreviewsContainer previewItems={this.getThingsToFollowUp()}
                                   fetchPreviews={this.fetchFollowUps}
                                   noPreviewsText="There are no things to follow up"
                                   invalidationStatus={invalidationStatus} />
            </DocumentTitle>
        )
    }
}

FollowUp.propTypes = {
    things: PropTypes.array.isRequired,
    invalidationStatus: PropTypes.string.isRequired
}

const mapStateToProps = (state) => {
    return {
        things: state.followUps.followUps,
        invalidationStatus: state.followUps.invalidationStatus
    }
}

module.exports = connect(mapStateToProps)(FollowUp)