import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import Icon from 'react-fontawesome'
import useSheet from 'react-jss'
import classNames from 'classnames'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'

import * as MessageBoxActions from '../../actions/message-box-actions'
import MessageTypes from '../../../common/enums/message-types'
import Flexbox from '../UI/Flexbox'
import TextTruncate from '../UI/TextTruncate'
import styleVars from '../style-vars'
import Close from '../../static/close-message-box.svg'
import Expand from '../../static/expand-message-box.svg'
import {GeneralConstants} from '../../constants'

class MessageTabs extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, MessageTabs.prototype)
    }

    selectMessageBox(selectedMessageBox) {
        const {dispatch, activeMessageBox} = this.props
        dispatch(MessageBoxActions.selectMessageBox(activeMessageBox, selectedMessageBox))
    }

    onExpandedClick() {
        const {dispatch} = this.props
        dispatch(MessageBoxActions.openExpanded())
    }

    getMessageTabs() {
        const {messageBoxes, activeMessageBox, sheet: {classes}} = this.props

        if (!activeMessageBox || isEmpty(activeMessageBox))
            return null

        return messageBoxes.map(messageBox => {
            const expandButton = activeMessageBox && activeMessageBox.id === messageBox.id ?
                <img src={Expand} className={classes.tabExpand} onClick={() => this.onExpandedClick()} /> :
                null

            const tabClass = classNames(classes.tab, activeMessageBox && activeMessageBox.id === messageBox.id && classes.tabActive)

            return (
                <Flexbox key={messageBox.id} container="row" justifyContent="flex-end" alignItems="center" className={tabClass}>
                    <a onClick={() => this.selectMessageBox(messageBox)} className={classes.tabLink}>
                        <TextTruncate>{messageBox.title}</TextTruncate>
                    </a>
                    {expandButton}
                    <img src={Close} className={classes.tabClose} onClick={() => this.closeMessageBox(messageBox)} />
                </Flexbox>
            )
        })
    }

    newThingMessageBox() {
        const {dispatch} = this.props
        dispatch(MessageBoxActions.newMessageBox(MessageTypes.NEW_THING))
    }

    closeMessageBox(messageBox) {
        const {dispatch} = this.props
        dispatch(MessageBoxActions.closeMessageBox(messageBox.id))
    }

    allowMoreTabs() {
        const {messageBoxes} = this.props
        return messageBoxes.length < GeneralConstants.MAX_MESSAGE_PANEL_TABS
    }

    render () {
        const {sheet: {classes}} = this.props

        const messageTabs = this.getMessageTabs()

        const newTabClass = classNames(classes.newSection, !this.allowMoreTabs() && classes.newDisabled)

        return (
            <Flexbox name="message-box-top-bar" container="row" alignItems="center" className={classes.topBar}>
                {messageTabs}
                <Flexbox name="message-new" container="row" justifyContent="center" alignItems="center"
                         className={newTabClass} onClick={this.newThingMessageBox}>
                    <Icon name="plus" className={classes.newIcon} />
                </Flexbox>
            </Flexbox>
        )
    }
}

const style = {
    topBar: {
        height: 35
    },
    tab: {
        height: '100%',
        width: 130,
        padding: [0, 12, 0, 10],
        backgroundColor: styleVars.highlightColor,
        color: 'white',
        opacity: 0.5
    },
    tabActive: {
        opacity: 1
    },
    tabLink: {
        cursor: 'pointer',
        fontSize: '0.714em',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        flex: '1 1 auto',
        marginRight: 16,
        minWidth: 0
    },
    tabClose: {
        height: 9,
        width: 9,
        cursor: 'pointer',
        color: 'inherit'
    },
    tabExpand: {
        height: 9,
        width: 9,
        cursor: 'pointer',
        color: 'inherit',
        marginRight: 6
    },
    newSection: {
        width: 40,
        height: '100%',
        backgroundColor: styleVars.highlightColor,
        opacity: 0.2,
        cursor: 'pointer',
        '&:hover': {
            opacity: 0.4
        }
    },
    newIcon: {
        fontSize: '0.7em'
    },
    newDisabled: {
        cursor: 'not-allowed',
        '&:hover': {
            opacity: 0.2
        }
    }
}

MessageTabs.propTypes = {
    messageBoxes: PropTypes.array.isRequired,
    activeMessageBox: PropTypes.object
}

function mapStateToProps(state) {
    return {
        messageBoxes: state.messagePanel.messageBoxes,
        activeMessageBox: find(state.messagePanel.messageBoxes, {id: state.messagePanel.activeMessageBoxId}),
    }
}

export default useSheet(connect(mapStateToProps)(MessageTabs), style)
