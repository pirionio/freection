import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import classNames from 'classnames'
import useSheet from 'react-jss'
import {Page, Button, ProgressCircular} from 'react-onsenui'
import isEmpty from 'lodash/isEmpty'

import * as ThingCommandActions from '../../actions/thing-command-actions'
import Flexbox from '../UI/Flexbox'
import styleVars from '../style-vars'
import Logo from '../../static/logo-black.png'
import {GeneralConstants} from '../../constants'

class MobileMessageBox extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, MobileMessageBox.prototype)

        this.state = {
            message: {
                body: ''
            },
            isSending: false
        }
    }

    send() {
        const {dispatch} = this.props

        if (this.isSendDisabled())
            return

        this.setState({
            isSending: true
        })

        dispatch(ThingCommandActions.newThing(this.state.message))

        setTimeout(() => {
            this.setState({
                message: {
                    body: ''
                },
                isSending: false
            })
        }, GeneralConstants.MOBILE_SEND_DELAY)
    }

    textChanged(event) {
        this.setState({
            message: {
                body: event.target.value
            }
        })
    }

    isSendDisabled() {
        return this.state.isSending || isEmpty(this.state.message.body)
    }

    render() {
        const {sheet: {classes}} = this.props

        const textAreaClasses = classNames('textarea', classes.textArea)
        const sendButtonClasses = classNames(classes.sendButton, this.isSendDisabled() ? classes.sendButtonDisabled : undefined)

        return (
            <Page className={classes.page}>
                <Flexbox name="mobile-message-box" container="column" alignItems="center" className={classes.container}>
                    <img src={Logo} className={classes.logoImage} />
                    <textarea value={this.state.message.body} onChange={this.textChanged} className={textAreaClasses}
                              placeholder="Write your message here" />
                    <Button onClick={this.send} disabled={this.isSendDisabled()} modifier="large" className={sendButtonClasses}>
                        Send
                    </Button>
                    {this.state.isSending ? <ProgressCircular indeterminate className={classes.spinner} /> : null}
                </Flexbox>
            </Page>
        )


    }
}

const style = {
    page: {
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        '& .page__content': {
            height: '100%'
        }
    },
    container: {
        height: '100%',
        width: '100%',
        position: 'relative'
    },
    logoImage: {
        height: 30,
        width: 100,
        margin: 10
    },
    textArea: {
        height: 'calc(100% - 100px)',
        width: '100%',
        padding: 10,
        border: 'none',
        outline: 'none',
        resize: 'none',
        lineHeight: 2,
        backgroundColor: 'white'
    },
    sendButton: {
        height: 50,
        width: '100%',
        lineHeight: '1.7',
        backgroundColor: styleVars.highlightColor,
        color: 'white',
        border: 'none',
        borderRadius: 0,
        fontSize: '1.5em',
        textTransform: 'uppercase',
        letterSpacing: '0.025em'
    },
    sendButtonDisabled: {
        opacity: 0.5
    },
    spinner: {
        position: 'absolute',
        top: '50%',
        bottom: '50%',
        left: 'auto',
        right: 'auto'
    }
}

export default useSheet(connect()(MobileMessageBox), style)