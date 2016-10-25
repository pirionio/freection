import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import orderBy from 'lodash/orderBy'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'

import Flexbox from '../UI/Flexbox'
import PreviewsContainer from '../Preview/PreviewsContainer'
import styleVars from '../style-vars'
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
        return orderBy(this.props.followUps, 'createdAt', 'desc').map(followUp => {
            const {thing, commands} = followUp

            if (thing.type.key === EntityTypes.SLACK.key)
                return (<SlackPreviewItem thing={thing} key={thing.id} commands={commands} />)

            return (<FollowUpPreviewItem thing={thing} key={thing.id} commands={commands} />)
        })
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
            <Flexbox name="follow-ups-container" grow={1} container="column" className={classes.container}>
                <PreviewsContainer previewItems={this.getThingsToFollowUp()}
                                   fetchPreviews={this.fetchFollowUps}
                                   noPreviews={this.getNoPreviews()}
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

