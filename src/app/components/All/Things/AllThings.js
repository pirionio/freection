import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'
import orderBy from 'lodash/orderBy'
import {chain} from 'lodash/core'

import Flexbox from '../../UI/Flexbox'
import * as AllThingsActions from '../../../actions/all-things-actions'
import PreviewsContainer from '../../Preview/PreviewsContainer'
import Placeholder from '../../Preview/Placeholder'
import AllThingsPreviewItem from './AllThingsPreviewItem'
import EmailThingPreviewItem from './EmailThingPreviewItem'
import ExternalPreviewItem from './ExternalPreviewItem'
import EntityTypes from '../../../../common/enums/entity-types'
import styleVars from '../../style-vars'

class AllThings extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, AllThings.prototype)
    }

    fetchAllThings() {
        const {dispatch} = this.props
        dispatch(AllThingsActions.fetchAllThings())
    }

    getAllThings() {
        const {sheet: {classes}} = this.props

        const things = orderBy(this.props.things, this.getThingUpdateDate, 'desc').map(thing => {
            if ([EntityTypes.GITHUB.key, EntityTypes.EXTERNAL.key].includes(thing.type.key)) {
                return <ExternalPreviewItem thing={thing} key={thing.id} />
            } else if (thing.type.key === EntityTypes.EMAIL_THING.key) {
                return <EmailThingPreviewItem thing={thing} key={thing.id} />
            }

            return <AllThingsPreviewItem thing={thing} key={thing.id} />
        })

        return (
            <div name="all-things-content" className={classes.content}>
                {things}
            </div>
        )
    }

    getThingUpdateDate(thing) {
        return chain(thing.events).map('createdAt').max().value()
    }

    getPlaceholder() {
        return (
            <Placeholder title="No things"
                         subTitle="Here you will find all of the things ever sent to you or by you." />
        )
    }

    render() {
        const {invalidationStatus, sheet: {classes}} = this.props

        return (
            <Flexbox name="all-things-container" grow={1} container="column" className={classes.container}>
                <PreviewsContainer previewItems={this.getAllThings()}
                                   fetchPreviews={this.fetchAllThings}
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
    },
    content: {
        maxWidth: styleVars.maxContentWidth
    }
}

AllThings.propTypes = {
    things: PropTypes.array.isRequired,
    invalidationStatus: PropTypes.string.isRequired
}

function mapStateToProps(state) {
    return {
        things: state.allThings.things,
        invalidationStatus: state.allThings.invalidationStatus
    }
}

export default useSheet(connect(mapStateToProps)(AllThings), style)