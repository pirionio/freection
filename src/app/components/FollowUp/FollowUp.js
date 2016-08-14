const React = require('react')
const {Component, PropTypes} = React
const DocumentTitle = require('react-document-title')
const {connect} = require('react-redux')
const orderBy = require('lodash/orderBy')
const classAutobind = require('class-autobind').default

const PreviewsContainer = require('../Preview/PreviewsContainer')
const styleVars = require('../style-vars')
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
        return orderBy(this.props.things, 'createdAt', 'desc').map(thing =>
            <FollowUpPreviewItem thing={thing} key={thing.id} />)
    }

    getTitle() {
        if (this.props.things.length > 0)
            return `Freection (${this.props.things.length}) - Follow Up`
        else
            return 'Freection - Follow Up'
    }

    getNoPreviews() {
        return {
            texts: [
                'Nothing to follow up.',
                'Damn! You\'re good!'
            ],
            logoColor: styleVars.basePurpleColor
        }
    }

    render() {
        const {invalidationStatus} = this.props

        return (
            <DocumentTitle title={this.getTitle()}>
                <PreviewsContainer previewItems={this.getThingsToFollowUp()}
                                   fetchPreviews={this.fetchFollowUps}
                                   noPreviews={this.getNoPreviews()}
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