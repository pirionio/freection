const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const radium = require('radium')
const classAutobind = require('class-autobind').default
const DocumentTitle = require('react-document-title')
const clickOutside = require('react-click-outside')
const Icon = require('react-fontawesome')
const {goBack} = require('react-router-redux')

const isEmpty = require('lodash/isEmpty')
const reject = require('lodash/reject')
const map = require('lodash/map')

const Button = require('../UI/Button')
const CommentList = require('../Comment/CommentList')
const Ellipse = require('../UI/Ellipse')
const TextTruncate = require('../UI/TextTruncate')
const MessagePanel = require('../MessageBox/MessagePanel')
const Flexbox = require('../UI/Flexbox')
const styleVars = require('../style-vars')

const ThingHelper = require('../../helpers/thing-helper')
const MessageBoxActions = require('../../actions/message-box-actions')
import ThingStatus from '../../../common/enums/thing-status'
import MessageTypes from '../../../common/enums/message-types'

class Board extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, Board.prototype)
    }

    componentDidMount() {
        const {dispatch, board} = this.props
        dispatch(MessageBoxActions.newMessageBox(MessageTypes.COMMENT_THING, board))
    }

    componentWillUnmount() {
        const {dispatch, messageBox} = this.props
        dispatch(MessageBoxActions.closeMessageBox(messageBox.id))
    }

    close() {
        const {dispatch} = this.props
        dispatch(goBack())
    }

    getDocumentTitle() {
        const {board} = this.props

        const unreadComments = this.getUnreadComments()

        if (unreadComments.length > 0)
            return `Freection (${unreadComments.length}) - ${board.subject}`
        else
            return `Freection - ${board.subject}`
    }

    getAllComments() {
        const {board} = this.props

        // Filter out CREATED events that have no text - since we allow creating a new Thing with no body at all.
        return board.events ?
            reject(ThingHelper.getAllMessages(board), message => !message.payload.text) :
            []
    }

    getUnreadComments() {
        const {board} = this.props
        return board.events ? ThingHelper.getUnreadMessages(board) : []
    }

    getStyles() {
        return {
            page: {
                height: '100%'
            },
            item: {
                marginBottom: '30px',
                padding: '0 39px',
                backgroundColor: styleVars.secondaryBackgroundColor
            },
            navigation: {
                height: '80px',
                option: {
                    fontSize: '0.7em',
                    fontWeight: 'bold',
                    color: 'black',
                    cursor: 'pointer',
                    textTransform: 'uppercase'
                },
                prev: {
                    borderRight: '1px solid black',
                    paddingRight: '25px',
                    arrow: {
                        marginRight: '25px'
                    }
                },
                next: {
                    marginLeft: '25px',
                    arrow: {
                        marginLeft: '25px'
                    }
                }
            },
            header: {
                height: '75px'
            },
            subject: {
                fontSize: '1.5em',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                color: styleVars.basePurpleColor,
                minWidth: 0
            },
            content: {
                height: '100%',
                overflowY: 'hidden',
                marginTop: '10px',
                position: 'relative'
            },
            close: {
                position: 'absolute',
                top: '25px',
                left: '-31px',
                fontSize: '2em',
                cursor: 'pointer'
            },
            recipients: {
                height: '25px',
                color: 'black'
            },
            activity: {
                position: 'absolute',
                bottom: '145'
            }
        }
    }

    getToList() {
        const {board} = this.props

        const recipients = [board.creator, ...board.to]
        return map(recipients, (user, index) => {
            return (
                <span>
                    {user.displayName}
                    {index < recipients.length - 1 ? <span style={{margin: '0 10px'}}>|</span> : ''}
                </span>

            )
        })
    }

    render() {
        const {board} = this.props

        const styles = this.getStyles()
        const toList = this.getToList()

        return (
            <DocumentTitle title={this.getDocumentTitle()}>
                <Flexbox name="full-item-page" container="column" style={styles.page}>
                    <Flexbox name="full-item-content" grow={1} container="column" style={styles.item}>
                        <Flexbox name="full-item-header" container="row" alignItems="center" style={styles.header}>
                            <Flexbox name="full-item-circle" width='19px' shrink={0} container='column' justifyContent="center">
                                <Ellipse width="8xp" height="8px" color={styleVars.baseBlueColor} />
                            </Flexbox>
                            <Flexbox name="full-item-subject" grow={1} style={styles.subject}>
                                <TextTruncate>
                                    <span>{board.subject}</span>
                                </TextTruncate>
                            </Flexbox>
                        </Flexbox>
                        <Flexbox name="recipients" container="row" alignItems="center" justifyContent="flex-start" style={styles.recipients}>
                            {toList}
                        </Flexbox>
                        <Flexbox name="full-item-body-container" grow={1} container="column" style={styles.content}>
                            <CommentList comments={this.getAllComments()} />
                            <Flexbox name="activity" container="row" style={styles.activity}>
                                <span style={{color: styleVars.basePurpleColor, marginRight: '3px'}}>Elon </span>
                                <span> created a new thing for </span>
                                <span style={{color: styleVars.basePurpleColor, marginLeft: '3px'}}> Max</span>
                                <span>:</span>
                                <strong style={{color: 'black', marginLeft: '3px'}}>
                                    Check main module for gradual UI migration
                                </strong>
                            </Flexbox>
                        </Flexbox>
                    </Flexbox>
                    <MessagePanel />
                    <Flexbox name="close" style={styles.close}>
                        <Icon name="times-circle" onClick={this.close} />
                    </Flexbox>
                </Flexbox>
            </DocumentTitle>
        )
    }
}

const max = {
    id: '111',
    displayName: 'Max Levchin',
    type: 'FREECTION',
    payload: {
        email: 'max.levchin.paypal@gmail.com',
        firstName: 'Max',
        lastName: 'Levchin'
    }
}

const elon = {
    id: '222',
    displayName: 'Elon Mask',
    type: 'FREECTION',
    payload: {
        email: 'elon.mask.paypal@gmail.com',
        firstName: 'Elon',
        lastName: 'Mask'
    }
}

const peter = {
    id: '333',
    displayName: 'Peter Thiel',
    type: 'FREECTION',
    payload: {
        email: 'peter.thiel.paypal@gmail.com',
        firstName: 'Peter',
        lastName: 'Thiel'
    }
}

Board.defaultProps = {
    board: {
        id: 'demo-board',
        creator: max,
        to: [elon, peter],
        createdAt: new Date(),
        subject: 'AngularJS Or React?',
        payload: {
            status: ThingStatus.INPROGRESS
        },
        events: [
            {
                id: '111',
                eventType: {
                    key: 'CREATED',
                    label: 'Created'
                },
                creator: max,
                createdAt: new Date(),
                payload: {
                    text: 'So we better start off the discussion of replacing our UI, these are the main candadtes. How do we proceed?',
                    isRead: true,
                    initialIsRead: true
                }
            },
            {
                id: '222',
                eventType: {
                    key: 'COMMENT',
                    label: 'Comment'
                },
                creator: peter,
                createdAt: new Date(),
                payload: {
                    text: 'Can we make the transition in steps?',
                    isRead: true,
                    initialIsRead: true
                }
            },
            {
                id: '333',
                eventType: {
                    key: 'COMMENT',
                    label: 'Comment'
                },
                creator: max,
                createdAt: new Date(),
                payload: {
                    text: 'I will have to check it out with the UI team. Certainly for diffenet modules.',
                    isRead: true,
                    initialIsRead: true
                }
            },
            {
                id: '444',
                eventType: {
                    key: 'COMMENT',
                    label: 'Comment'
                },
                creator: elon,
                createdAt: new Date(),
                payload: {
                    text: 'Let\'s check it out. I think we can start only with the admin module right now.',
                    isRead: true,
                    initialIsRead: true
                }
            }
        ]
    }
}

Board.propTypes = {
    board: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    messageBox: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        currentUser: state.auth,
        messageBox: state.messageBox
    }
}

module.exports = connect(mapStateToProps)(clickOutside(radium(Board)))