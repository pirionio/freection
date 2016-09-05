const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const classAutobind = require('class-autobind').default
const Icon = require('react-fontawesome')
const useSheet = require('react-jss').default
const classNames = require('classnames')

const find = require('lodash/find')
const isEmpty = require('lodash/isEmpty')

const MessageBoxActions = require('../../actions/message-box-actions')
const MessageTypes = require('../../../common/enums/message-types')

const Flexbox = require('../UI/Flexbox')
const TextTruncate = require('../UI/TextTruncate')
const styleVars = require('../style-vars')

class MessageTabs extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, MessageTabs.prototype)
    }

    selectMessageBox(selectedMessageBox) {
        const {dispatch, activeMessageBox} = this.props
        dispatch(MessageBoxActions.selectMessageBox(activeMessageBox, selectedMessageBox))
    }

    getMessageTabs() {
        const {messageBoxes, activeMessageBox, sheet: {classes}} = this.props

        if (!activeMessageBox || isEmpty(activeMessageBox))
            return null

        return messageBoxes.map(messageBox => {
            const closeButton = [MessageTypes.NEW_THING.key, MessageTypes.NEW_EMAIL.key].includes(messageBox.type.key) ?
                <Icon name="times" className={classes.tabClose} onClick={() => this.closeMessageBox(messageBox)} /> :
                null

            const tabClass = classNames(classes.tab, activeMessageBox && activeMessageBox.id === messageBox.id && classes.tabActive)

            return (
                <Flexbox key={messageBox.id} container="row" justifyContent="center" alignItems="center" className={tabClass}>
                    <a onClick={() => this.selectMessageBox(messageBox)} className={classes.tabLink}>
                        <TextTruncate>{messageBox.title}</TextTruncate>
                    </a>
                    {closeButton}
                </Flexbox>
            )
        })
    }

    newThingMessageBox() {
        const {dispatch} = this.props
        dispatch(MessageBoxActions.newMessageBox(MessageTypes.NEW_THING))
    }

    newEmailMessageBox() {
        const {dispatch} = this.props
        dispatch(MessageBoxActions.newMessageBox(MessageTypes.NEW_EMAIL))
    }

    closeMessageBox(messageBox) {
        const {dispatch} = this.props
        dispatch(MessageBoxActions.closeMessageBox(messageBox.id))
    }

    getNewMenu() {
        const {sheet: {classes}} = this.props

        const thingOptionClass = classNames(classes.menuOption, classes.thingOption)

        return (
            <div name="new-menu" key="new-menu" className={classes.newMenu}>
                <div name="new-menu-option" key="thing-option" onClick={this.newThingMessageBox} className={thingOptionClass}>New Thing</div>
                <div name="new-menu-option" key="email-option" onClick={this.newEmailMessageBox} className={classes.menuOption}>New Email</div>
                <span className={classes.menuArrow} />
            </div>
        )
    }

    render () {
        const {activeMessageBox, sheet: {classes}} = this.props

        const messageTabs = this.getMessageTabs()
        const newMenu = this.getNewMenu()

        return (
            <Flexbox name="message-box-top-bar" container="row" justifyContent="flex-end" alignItems="center" className={classes.topBar}>
                <Flexbox name="message-tabs" grow={1} container="row">
                    {messageTabs}
                </Flexbox>
                <div name="message-new" className={classes.newSection}>
                    <div className={classes.newButton} key="new-button">
                        <Icon name="plus" className={classes.newIcon} />
                        NEW
                    </div>
                    {newMenu}
                </div>
            </Flexbox>
        )
    }
}

const style = {
    topBar: {
        height: 37
    },
    tab: {
        height: '100%',
        minWidth: 132,
        maxWidth: 150,
        padding: [0, 16],
        backgroundColor: styleVars.highlightColor,
        color: 'white',
        opacity: 0.5
    },
    tabActive: {
        opacity: 1
    },
    tabLink: {
        width: '100%',
        cursor: 'pointer',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: '0.07em'
    },
    tabClose: {
        marginLeft: 20,
        cursor: 'pointer',
        color: 'inherit'
    },
    newSection: {
        '&:hover': {
            '& $newMenu': {
                display: 'block'
            }
        }
    },
    newButton: {
        height: 23,
        lineHeight: 2,
        width: 60,
        color: styleVars.secondaryColor,
        cursor: 'default',
        letterSpacing: '0.05em'
    },
    newIcon: {
        fontSize: '0.7em',
        marginRight: '3px',
    },
    newMenu: {
        display: 'none',
        position: 'absolute',
        right: -15,
        top: -68,
        height: 75,
        width: 115,
        backgroundColor: '#fafafa',
        border: '1px solid #e0e0e0'
    },
    menuArrow: {
        position: 'absolute',
        left: 38,
        bottom: -6,
        width: 0,
        height: 0,
        borderRight: '5px solid transparent',
        borderLeft: '5px solid transparent',
        borderTop: `6px solid ${styleVars.secondaryBackgroundColor}`
    },
    menuOption: {
        height: 37,
        width: '100%',
        paddingTop: 11,
        textAlign: 'center',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#ebe9e9'
        }
    },
    thingOption: {
        borderBottom: '1px solid #e0e0e0'
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

module.exports = useSheet(connect(mapStateToProps)(MessageTabs), style)
