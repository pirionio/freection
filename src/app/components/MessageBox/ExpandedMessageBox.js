import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Field, Form} from 'react-redux-form'
import classAutobind from 'class-autobind'
import AddressParser from 'email-addresses'
import useSheet from 'react-jss'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'
import isNil from 'lodash/isNil'
import classnames from 'classnames'

import Flexbox from '../UI/Flexbox'
import TextTruncate from '../UI/TextTruncate'
import MessageBody from './MessageBody'
import To from './To'
import styleVars from '../style-vars'
import * as ThingCommandActions from '../../actions/thing-command-actions'
import * as MessageBoxActions from '../../actions/message-box-actions'
import MessageTypes from '../../../common/enums/message-types'
import Close from '../../static/close-message-box.svg'
import Collapse from '../../static/collapse-message-box.svg'

class ExpandedMessageBox extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, ExpandedMessageBox.prototype)
    }

    closeMessageBox() {
        const {dispatch, activeMessageBox} = this.props
        dispatch(MessageBoxActions.closeMessageBox(activeMessageBox.id))
    }

    onCollapseClick() {
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

        const expandButton =
            <img src={Collapse} className={classes.titleCollapse} onClick={() => this.onCollapseClick()} />

        return (
            <Flexbox className={classes.title} container="row" justifyContent="flex-end" alignItems="center">
                <TextTruncate className={classes.titleText}>{activeMessageBox ? activeMessageBox.title: ''}</TextTruncate>
                {expandButton}
                <img src={Close} className={classes.titleClose} onClick={() => this.closeMessageBox()} />
            </Flexbox>)
    }

    getSubject() {
        const {sheet: {classes}} = this.props

        if (!this.hasSubject())
            return null

        return (
            <Flexbox grow={0} shrink={0} name="expanded-message-subject" container="row" className={classes.subject}>
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
            <Flexbox grow={0} shrink={0} name="expanded-message-to" container="row" className={classes.to}>
                <Flexbox className={classes.label} grow={0} shrink={0} container="column" justifyContent="center"
                         onClick={() => this.messageTo.focus() }>
                    To:
                </Flexbox>
                <To model="messageBox.message"
                    containerClassName={classes.inputGroup}
                    inputClassName={classes.textField}
                    tabIndex={3}
                    inputRef={ref => this.messageTo = ref} />
            </Flexbox>)
    }

    getBody() {
        const {sheet: {classes}} = this.props

        const bodyClass = this.hasSubject() && this.hasTo() ? classes.bodyWithSubject : classes.bodyAlone

        return (
            <MessageBody className={bodyClass} tabIndex="2" ref={ref => this.messageBody = ref} />
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
            messageBox && messageBox.message && messageBox.message.subject &&
            AddressParser.parseOneAddress(messageBox.message.to)) ||
            (activeMessageBox && activeMessageBox.type.key !== MessageTypes.NEW_THING.key)

        return isNil(activeMessageBox) || activeMessageBox.ongoingAction || !addressValid
    }

    send() {
        const {dispatch, messageBox, activeMessageBox} = this.props

        let promise
        switch (activeMessageBox.type.key) {
            case MessageTypes.NEW_THING.key:
                promise = dispatch(ThingCommandActions.newThing(messageBox.message))
                break
            case MessageTypes.COMMENT_THING.key:
                promise = dispatch(ThingCommandActions.comment(activeMessageBox.context.id, messageBox.message.body))
                break
            case MessageTypes.THING_ACTION.key:
                promise = messageBox.action(messageBox.message.body)
                break
        }

        dispatch(MessageBoxActions.messageSent(activeMessageBox.id, promise))
    }

    render() {
        const {opened, sheet: {classes}} = this.props

        if (!opened)
            return null

        if (!opened)
            return null

        return (
            <div>
                <div className={classes.overlay} />
                <div className={classes.modal}>
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
    overlay: {
        backgroundColor: 'rgba(236, 236, 236, 0.5)',
        zIndex: styleVars.modalOverlayZIndex,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
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
        height: 7,
        width: 7,
        cursor: 'pointer',
        color: 'inherit',
        marginLeft: 8
    },
    titleCollapse: {
        height: 7,
        width: 7,
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
    subject: {
        marginBottom: 25
    },
    to: {
        marginTop: 25
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
    },
    bodyWithSubject: {
        height: 310
    },
    bodyAlone: {
        height: 420
    }
}


export default useSheet(connect(mapStateToProps)(ExpandedMessageBox), style)
