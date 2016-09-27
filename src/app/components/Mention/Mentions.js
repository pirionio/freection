import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import orderBy from 'lodash/orderBy'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'

import Page from '../UI/Page'
import styleVars from '../style-vars'
import PreviewsContainer from '../Preview/PreviewsContainer'
import * as MentionActions from '../../actions/mentions-actions'
import MentionPreviewItem from './MentionPreviewItem'

class Mentions extends Component {
    constructor(props) {
        super(props)
        classAutobind(this)
    }

    fetchMentions() {
        const {dispatch} = this.props
        dispatch(MentionActions.fetchMentions())
    }

    getMentionedThings() {
        return orderBy(this.props.things, 'createdAt', 'desc').map(thing => {
            return <MentionPreviewItem thing={thing} key={thing.id} />
        })
    }

    getTitle() {
        if (this.props.things.length > 0)
            return `Freection (${this.props.things.length}) - Mentioned`

        return 'Freection - Mentioned'
    }

    getNoPreviews() {
        return {
            texts: [
                'You were not mentioned in anything.',
                'Lucky you.'
            ],
            logoColor: styleVars.basePinkColor
        }
    }

    render() {
        const {invalidationStatus, sheet: {classes}} = this.props

        return (
            <Page title={this.getTitle()} className={classes.page}>
                <PreviewsContainer previewItems={this.getMentionedThings()}
                                   fetchPreviews={this.fetchMentions}
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

Mentions.propTypes = {
    things: PropTypes.array.isRequired,
    invalidationStatus: PropTypes.string.isRequired
}

function mapStateToProps (state) {
    return {
        things: state.mentions.things,
        invalidationStatus: state.mentions.invalidationStatus
    }
}

export default useSheet(connect(mapStateToProps)(Mentions), style)