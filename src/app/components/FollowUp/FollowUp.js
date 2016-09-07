const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const orderBy = require('lodash/orderBy')
const classAutobind = require('class-autobind').default
const useSheet = require('react-jss').default

const isEmpty = require('lodash/isEmpty')

const Page = require('../UI/Page')
const PreviewsContainer = require('../Preview/PreviewsContainer')
const styleVars = require('../style-vars')
import * as  FollowUpsActions from '../../actions/follow-up-actions'
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
                'Damn, You\'re good!'
            ],
            logoColor: styleVars.basePurpleColor
        }
    }

    render() {
        const {invalidationStatus, sheet: {classes}} = this.props

        return (
            <Page title={this.getTitle()} className={classes.page}>
                <PreviewsContainer previewItems={this.getThingsToFollowUp()}
                                   fetchPreviews={this.fetchFollowUps}
                                   noPreviews={this.getNoPreviews()}
                                   invalidationStatus={invalidationStatus}>
                    {this.props.children}

                </PreviewsContainer>
            </Page>
        )
    }
}

const style = {
    page: {
        position: 'relative'
    }
}

FollowUp.propTypes = {
    things: PropTypes.array.isRequired,
    invalidationStatus: PropTypes.string.isRequired
}

function mapStateToProps (state) {
    return {
        things: state.followUps.followUps,
        invalidationStatus: state.followUps.invalidationStatus
    }
}

module.exports = useSheet(connect(mapStateToProps)(FollowUp), style)