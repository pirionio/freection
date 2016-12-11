import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'
import forOwn from 'lodash/forOwn'
import groupBy from 'lodash/groupBy'

import Flexbox from '../UI/Flexbox'
import FollowUpGroup from './FollowUpGroup'
import PreviewsContainer from '../Preview/PreviewsContainer'
import Placeholder from '../Preview/Placeholder'
import * as  FollowUpsActions from '../../actions/follow-up-actions'
import SharedConstants from '../../../common/shared-constants'

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
        const {followUps} = this.props

        const followUpsByTo = groupBy(followUps, followUp => {
            return followUp.thing.to ? followUp.thing.to.displayName : SharedConstants.DEFAULT_FOLLOWUP_TO_CATEGORY
        })

        const followUpCategories = []

        forOwn(followUpsByTo, (categoryFollowUps, categoryTitle) => {
            const category = {
                key: categoryTitle,
                label: categoryTitle
            }

            followUpCategories.push(
                <FollowUpGroup key={`container-${category.key}`} category={category} followUps={categoryFollowUps} />
            )
        })

        return followUpCategories
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

