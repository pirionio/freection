import React, {Component, PropTypes} from 'react'
import useSheet from 'react-jss'
import isArray from 'lodash/isArray'

import {InvalidationStatus} from '../../constants'
import Flexbox from '../UI/Flexbox'
import MessagePanel from '../MessageBox/MessagePanel'
import Scrollable from '../Scrollable/Scrollable'
import Loader from '../UI/Loader'
import styleVars from '../style-vars'

class PreviewsContainer extends Component {
    componentDidMount () {
        this.props.fetchPreviews()
    }

    componentWillReceiveProps() {
        // Will fetch messages only if needed
        this.props.fetchPreviews()
    }

    getFetching() {
        return <Loader />
    }

    getNoPreviews() {
        return (
            <Flexbox name="preview-content" grow={1} container="column" justifyContent="center" alignItems="center">
                {this.props.getPlaceholder()}
            </Flexbox>
        )
    }

    isInFullItemMode() {
        return this.props.children
    }

    getPreviews() {
        const {previewItems, sheet: {classes}} = this.props

        // We use the children props to understand if we're in full-item mode or not.
        // The children arrive from the Router, and they would exist if the user navigated to a route that has a full-item in it.
        // The Message Panel, in this case, is included in the full item page, so that it appears above the overlay.

        return (
            <Flexbox name="preview-content" container="column" grow={1} style={{marginBottom: '15px'}}>
                <Scrollable className={this.isInFullItemMode() && classes.blur}>
                    {previewItems}
                </Scrollable>
            </Flexbox>
        )
    }

    render () {
        const {children, previewItems, invalidationStatus, sheet: {classes}} = this.props

        // console.log('PreviewsContainer - previewItems - LATER:', previewItems[1].props.children[1].map(item => item.props.thing))

        let content = null
        if (invalidationStatus === InvalidationStatus.FETCHING)
            content = this.getFetching()
        else if (!previewItems || (isArray(previewItems) && !previewItems.length))
            content = this.getNoPreviews()
        else
            content = this.getPreviews()

        return (
            <Flexbox name="preview-container" grow={1} container="column" justifyContent="flex-end">
                {this.isInFullItemMode() ? children : null}
                {content}
                {!this.isInFullItemMode() ?
                 <Flexbox container="column" className={classes.messagePanel}>
                     <MessagePanel />
                 </Flexbox> :
                 null}
            </Flexbox>
        )
    }
}

const style = {
    blur: {
        filter: 'blur(3px)'
    },
    messagePanel: {
        width: '100%',
        padding: [0, 40],
        maxWidth: styleVars.maxContentWidth
    }
}

PreviewsContainer.propTypes = {
    previewItems: PropTypes.any.isRequired,
    fetchPreviews: PropTypes.func.isRequired,
    getPlaceholder: PropTypes.func.isRequired,
    invalidationStatus: PropTypes.string.isRequired
}

export default useSheet(PreviewsContainer, style)