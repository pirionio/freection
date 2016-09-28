import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Field, Form} from 'react-redux-form'
import classAutobind from 'class-autobind'
import AddressParser from 'email-addresses'
import useSheet from 'react-jss'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'
import isNil from 'lodash/isNil'
import Icon from 'react-fontawesome'
import classnames from 'classnames'

import Flexbox from '../UI/Flexbox'
import TextTruncate from '../UI/TextTruncate'
import To from './To'
import styleVars from '../style-vars'
import * as ThingCommandActions from '../../actions/thing-command-actions'
import * as MessageBoxActions from '../../actions/message-box-actions'
import MessageTypes from '../../../common/enums/message-types'

class ExpandedMessageBox extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, ExpandedMessageBox.prototype)
    }

    closeMessageBox() {
        const {dispatch, activeMessageBox} = this.props
        dispatch(MessageBoxActions.closeMessageBox(activeMessageBox.id))
    }

    onCompressClick() {
        const {dispatch} = this.props
        dispatch(MessageBoxActions.closeExpanded())
    }

    componentDidUpdate(prevProps) {
        const {messageBox, opened} = this.props

        if (opened && !prevProps.opened) {
            if (!messageBox.message || isEmpty(messageBox.message.subject)) {
                this.messageSubject.focus()
            } else {
                this.messageBody.focus()
            }
        }
    }

    getTitle() {
        const {sheet: {classes}, activeMessageBox} = this.props

        const closeButton = activeMessageBox && [MessageTypes.NEW_THING.key, MessageTypes.NEW_EMAIL.key].includes(activeMessageBox.type.key) ?
            <Icon name="times" className={classes.titleClose} onClick={() => this.closeMessageBox()} /> :
            null

        const expandButton =
            <Icon name="compress" className={classes.titleCompress} onClick={() => this.onCompressClick()} />

        return (
            <Flexbox className={classes.title} container="row" justifyContent="flex-end" alignItems="center">
                <TextTruncate className={classes.titleText}>{activeMessageBox ? activeMessageBox.title: ''}</TextTruncate>
                {expandButton}
                {closeButton}
            </Flexbox>)
    }

    getSubject() {
        const {sheet: {classes}} = this.props

        if (!this.hasSubject())
            return null

        return (
            <Flexbox grow={0} shrink={0} name="expanded-message-subject" container="row">
                <Flexbox className={classes.label} grow={0} shrink={0} container="column" justifyContent="center"
                         onClick={() => this.messageSubject.focus() }>
                    Subject:
                </Flexbox>
                <Flexbox grow={1} shrink={1} className={classes.inputGroup}>
                    <Field model="messageBox.message.subject">
                        <input type="text"
                               tabIndex="1"
                               className={classes.textField}
                               ref={ref => this.messageSubject = ref} />
                    </Field>
                </Flexbox>
            </Flexbox>
        )
    }

    getTo() {
        const {sheet: {classes}} = this.props

        if (!this.hasTo())
            return null

        return (
            <Flexbox grow={0} shrink={0} name="expanded-message-to" container="row">
                <Flexbox className={classes.label} grow={0} shrink={0} container="column" justifyContent="center"
                         onClick={() => this.messageTo.focus() }>
                    To:
                </Flexbox>
                <To model="messageBox.message.to"
                    containerClassName={classes.inputGroup}
                    inputClassName={classes.textField}
                    tabIndex={3}
                    inputRef={ref => this.messageTo = ref} />
            </Flexbox>)
    }

    getBody() {
        const {sheet: {classes}} = this.props

        return (
            <Field model="messageBox.message.body">
                <textarea className={classes.textArea}
                          tabIndex="2"
                          placeholder="Write your message here"
                          ref={ref => this.messageBody = ref} />
            </Field>
        )
    }

    hasSubject() {
        const {activeMessageBox} = this.props
        return !activeMessageBox || !activeMessageBox.context
    }

    hasTo() {
        const {activeMessageBox} = this.props
        return !activeMessageBox || !activeMessageBox.context
    }

    getSendButton() {
        const {sheet: {classes}} = this.props
        const isDisabled = this.isSendDisabled()

        const buttonClass = classnames(classes.sendButton, isDisabled && classes.disabledSendButton)

        return (<button type="submit"
                tabIndex="4"
                disabled={isDisabled}
                className={buttonClass} >
            SEND
        </button>)
    }

    isSendDisabled() {
        const {activeMessageBox, messageBox} = this.props
        const addressValid = (activeMessageBox && activeMessageBox.type.key === MessageTypes.NEW_THING.key &&
            messageBox && messageBox.message && AddressParser.parseOneAddress(messageBox.message.to)) ||
            (activeMessageBox && activeMessageBox.type.key !== MessageTypes.NEW_THING.key)

        return isNil(activeMessageBox) || activeMessageBox.ongoingAction || !addressValid
    }

    send() {
        const {dispatch, messageBox, activeMessageBox} = this.props

        let promise, shouldClose = true
        switch (activeMessageBox.type.key) {
            case MessageTypes.NEW_THING.key:
                promise = dispatch(ThingCommandActions.newThing(messageBox.message))
                break
            case MessageTypes.COMMENT_THING.key:
                promise = dispatch(ThingCommandActions.comment(activeMessageBox.context.id, messageBox.message.body))
                shouldClose = false
                break
        }

        dispatch(MessageBoxActions.messageSent(activeMessageBox.id, shouldClose, promise))
    }

    render() {
        const {opened, sheet: {classes}} = this.props

        const modalClassname = classnames(classes.modal, !opened ? classes.closed : '')
        const overlayClassname = classnames(classes.overlay, !opened ? classes.closed : '')

        return (
            <div>
                <div className={overlayClassname} />
                <div className={modalClassname}>
                    <Form model="messageBox" onSubmit={this.send} className={classes.form}>
                        <Flexbox name="expanded-message-box" container="column" className={classes.container}>
                            {this.getTitle()}
                            <Flexbox container="column" className={classes.box}>
                                <Flexbox className={classes.content} grow={1} container="column">
                                    {this.getSubject()}
                                    {this.getBody()}
                                    {this.getTo()}
                                </Flexbox>
                                <hr className={classes.hr} />
                                <Flexbox className={classes.actions} shrink={0} container="column">
                                    {this.getSendButton()}
                                </Flexbox>
                            </Flexbox>
                        </Flexbox>
                    </Form>
                </div>
            </div>
        )
    }
}

ExpandedMessageBox.propTypes = {
    messageBox: PropTypes.object.isRequired,
    activeMessageBox: PropTypes.object,
    opened: PropTypes.bool
}

function mapStateToProps(state) {
    return {
        activeMessageBox: find(state.messagePanel.messageBoxes, {id: state.messagePanel.activeMessageBoxId}),
        messageBox: state.messageBox,
        opened: state.expandedMessageBox.opened
    }
}

const style = {
    closed: {
        display: 'none'
    },
    overlay: {
        backgroundColor: 'rgba(236, 236, 236, 0.5)',
        zIndex: styleVars.modalOverlayZIndex,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modal: {
        backgroundColor: 'rgba(0,0,0, 0.0)',
        position : 'absolute',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        width: '95%',
        height: '95%',
        maxWidth: '760px',
        maxHeight: '575px',
        transform: 'translate(-50%, -50%)',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        zIndex: styleVars.modalZIndex,
        outline: 'none'
    },
    form: {
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
    },
    container: {
        height: '100%'
    },
    title: {
        backgroundColor: styleVars.highlightColor,
        height: '30px',
        width: 130,
        padding: [0, 12, 0, 10],
        color: 'white'
    },
    titleText: {
        textTransform: 'uppercase',
        fontSize: '0.714em',
        letterSpacing: '0.1em',
        flex: '1 1 auto',
        marginRight: 8
    },
    titleClose: {
        fontSize: '0.714em',
        cursor: 'pointer',
        color: 'inherit',
        marginLeft: 8
    },
    titleCompress: {
        fontSize: '0.714em',
        cursor: 'pointer',
        color: 'inherit',
        marginLeft: 8
    },
    box: {
        backgroundColor: 'white',
        border: `1px solid ${styleVars.highlightColor}`,
        height: '100%',
        flex: '1 1 auto'
    },
    content: {
        padding: '30px 30px 20px 30px'
    },
    actions: {
        padding: '20px 30px 20px 30px'
    },
    label: {
        color: '#959595',
        lineHeight: 2,
        marginRight: '15px'
    },
    inputGroup: {
        lineHeight: 2,
        width: '100%'
    },
    textField: {
        width: '100%',
        border: 'none',
        outline: 'none',
        resize: 'none'
    },
    textArea: {
        width: '100%',
        height: '100%',
        border: 'none',
        outline: 'none',
        resize: 'none',
        flex: '1 1 auto',
        lineHeight: 2,
        padding: 0,
        marginTop: '10px'
    },
    hr: {
        width: '100%',
        borderTopWidth: '1px',
        borderTopColor: '#D7D7D7',
        borderTopStyle: 'solid',
        borderBottomStyle: 'none',
        borderRightStyle: 'none',
        borderLeftStyle: 'none',
        margin: 0
    },
    sendButton: {
        height: '33px',
        width: '82px',
        color: 'white',
        outline: 'none',
        fontSize: '0.857em',
        border: 'none',
        backgroundColor: styleVars.highlightColor,
        '&:hover': {
            cursor: 'pointer',
            color: styleVars.primaryColor
        }
    },
    disabledSendButton: {
        opacity: 0.5,
        cursor: 'not-allowed',
        '&:hover': {
            cursor: 'not-allowed'
        }
    }
}


export default useSheet(connect(mapStateToProps)(ExpandedMessageBox), style)