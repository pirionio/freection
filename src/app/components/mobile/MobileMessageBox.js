import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import classNames from 'classnames'
import useSheet from 'react-jss'
import {Page, Button} from 'react-onsenui'

import * as ThingCommandActions from '../../actions/thing-command-actions'
import Flexbox from '../UI/Flexbox'
import styleVars from '../style-vars'
import Logo from '../../static/logo-black.png'

class MobileMessageBox extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, MobileMessageBox.prototype)

        this.state = {
            message: {
                body: ''
            }
        }
    }

    send() {
        const {dispatch} = this.props
        dispatch(ThingCommandActions.newThing(this.state.message)).then(() => {
            this.setState({
                message: {
                    body: ''
                }
            })
        })
    }

    textChanged(event) {
        this.setState({
            message: {
                body: event.target.value
            }
        })
    }

    render() {
        const {sheet: {classes}} = this.props

        const textAreaClasses = classNames('textarea', classes.textArea)

        return (
            <Page className={classes.page}>
                <Flexbox name="mobile-message-box" container="column" alignItems="center" className={classes.container}>
                    <img src={Logo} className={classes.logoImage} />
                    <textarea value={this.state.message.body} onChange={this.textChanged} className={textAreaClasses}
                              placeholder="Write your message here" />
                    <Button onClick={this.send} modifier="large" className={classes.sendButton}>
                        Send
                    </Button>
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
        width: '100%'
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
    }
}

export default useSheet(connect()(MobileMessageBox), style)