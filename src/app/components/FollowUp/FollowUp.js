import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import orderBy from 'lodash/orderBy'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'

import Page from '../UI/Page'
import PreviewsContainer from '../Preview/PreviewsContainer'
import styleVars from '../style-vars'
import * as  FollowUpsActions from '../../actions/follow-up-actions'
import FollowUpPreviewItem from './FollowUpPreviewItem'

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

export default useSheet(connect(mapStateToProps)(FollowUp), style)

