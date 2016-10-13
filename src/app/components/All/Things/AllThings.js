import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'
import orderBy from 'lodash/orderBy'
import {chain} from 'lodash/core'

import Flexbox from '../../UI/Flexbox'
import * as AllThingsActions from '../../../actions/all-things-actions'
import styleVars from '../../style-vars'
import PreviewsContainer from '../../Preview/PreviewsContainer'
import AllThingsPreviewItem from './AllThingsPreviewItem'
import EmailThingPreviewItem from './EmailThingPreviewItem'
import GithubPreviewItem from './GithubPreviewItem'
import EntityTypes from '../../../../common/enums/entity-types'

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
        return orderBy(this.props.things, this.getThingUpdateDate, 'desc').map(thing => {
            if (thing.type.key === EntityTypes.GITHUB.key) {
                return <GithubPreviewItem thing={thing} key={thing.id} />
            } else if (thing.type.key === EntityTypes.EMAIL_THING.key) {
                return <EmailThingPreviewItem thing={thing} key={thing.id} />
            }

            return <AllThingsPreviewItem thing={thing} key={thing.id} />
        })
    }

    getThingUpdateDate(thing) {
        return chain(thing.events).map('createdAt').max().value()
    }

    getNoPreviews() {
        return {
            texts: [
                'You have no Things at all.',
                'Welcome to Freection, then!'
            ],
            logoColor: styleVars.baseGreenColor
        }
    }

    render() {
        const {invalidationStatus, sheet: {classes}} = this.props

        return (
            <Flexbox name="all-things-container" grow={1} container="column" className={classes.container}>
                <PreviewsContainer previewItems={this.getAllThings()}
                                   fetchPreviews={this.fetchAllThings}
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