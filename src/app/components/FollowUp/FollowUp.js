import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import orderBy from 'lodash/orderBy'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'

import Flexbox from '../UI/Flexbox'
import PreviewsContainer from '../Preview/PreviewsContainer'
import Placeholder from '../Preview/Placeholder'
import * as  FollowUpsActions from '../../actions/follow-up-actions'
import FollowUpPreviewItem from './FollowUpPreviewItem'
import SlackPreviewItem from './SlackPreviewItem'
import EntityTypes from '../../../common/enums/entity-types'

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
        return orderBy(this.props.followUps, 'thing.createdAt', 'desc').map(followUp => {
            const {thing, commands} = followUp

            if (thing.type.key === EntityTypes.SLACK.key)
                return (<SlackPreviewItem thing={thing} key={thing.id} commands={commands} />)

            return (<FollowUpPreviewItem thing={thing} key={thing.id} commands={commands} />)
        })
    }

    getPlaceholder() {
        return (
            <Placeholder title="No things to follow up"
                         subTitle="Come to this page to follow up all the things you sent to others." />
        )
    }

    render() {
        const {invalidationStatus, sheet: {classes}} = this.props

        return (
            <Flexbox name="follow-ups-container" grow={1} container="column" className={classes.container}>
                <PreviewsContainer previewItems={this.getThingsToFollowUp()}
                                   fetchPreviews={this.fetchFollowUps}
                                   getPlaceholder={this.getPlaceholder}
                                   invalidationStatus={invalidationStatus}>
                    {this.props.children}

                </PreviewsContainer>
            </Flexbox>
        )
    }
}

const style = {
    container: {
        position: 'relative'
    }
}

FollowUp.propTypes = {
    followUps: PropTypes.array.isRequired,
    invalidationStatus: PropTypes.string.isRequired
}


function mapStateToProps (state) {
    return {
        followUps: state.followUps.followUps,
        invalidationStatus: state.followUps.invalidationStatus
    }
}

export default useSheet(connect(mapStateToProps)(FollowUp), style)

