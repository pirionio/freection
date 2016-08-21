const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const classAutobind = require('class-autobind').default
const radium = require('radium')
const Icon = require('react-fontawesome')

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
        const {messageBoxes, activeMessageBox} = this.props
        const styles = this.getStyles()

        if (!activeMessageBox || isEmpty(activeMessageBox))
            return null

        return messageBoxes.map(messageBox => {
            const closeButton = [MessageTypes.NEW_THING.key, MessageTypes.NEW_EMAIL.key].includes(messageBox.type.key) ?
                <Icon name="times" style={styles.tab.close} onClick={() => this.closeMessageBox(messageBox)} /> :
                null

            return (
                <Flexbox key={messageBox.id} container="row" justifyContent="center" alignItems="center"
                         style={[styles.tab, activeMessageBox && activeMessageBox.id === messageBox.id && styles.tab.active]}>

                    <a onClick={() => this.selectMessageBox(messageBox)} style={styles.tab.link}>
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
        const styles = this.getStyles()

        const isNewRollover = radium.getState(this.state, 'new-button', ':hover')
        const isMenuRollover = radium.getState(this.state, 'new-menu', ':hover')

        if (!isNewRollover && !isMenuRollover)
            return null

        return (
            <div name="new-menu" key="new-menu" style={styles.new.menu}>
                <div name="new-menu-option" key="thing-option" onClick={this.newThingMessageBox}
                     style={[styles.new.menuOption, {borderBottom: '1px solid #e0e0e0'}]}>New Thing</div>
                <div name="new-menu-option" key="email-option" onClick={this.newEmailMessageBox}
                     style={styles.new.menuOption}>New Email</div>
                <span style={styles.new.menu.arrow} />
            </div>
        )
    }

    getStyles() {
        return {
            topBar: {
                height: '37px'
            },
            tab: {
                height: '100%',
                minWidth: '132px',
                maxWidth: '150px',
                padding: '0 16px',
                backgroundColor: styleVars.highlightColor,
                color: 'white',
                opacity: '0.5',
                active: {
                    opacity: '1'
                },
                link: {
                    width: '100%',
                    cursor: 'pointer',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    letterSpacing: '0.07em'
                },
                close: {
                    marginLeft: '20px',
                    cursor: 'pointer',
                    color: 'inherit'
                }
            },
            new: {
                button: {
                    height: '23px',
                    lineHeight: '23px',
                    width: '60px',
                    color: styleVars.secondaryColor,
                    cursor: 'default',
                    letterSpacing: '0.05em',
                    ':hover': {}
                },
                icon: {
                    fontSize: '0.7em'
                },
                menu: {
                    position: 'absolute',
                    right: '-15px',
                    top: '-68px',
                    height: '75px',
                    width: '115px',
                    backgroundColor: '#fafafa',
                    border: '1px solid #e0e0e0',
                    ':hover': {},
                    arrow: {
                        position: 'absolute',
                        left: '38px',
                        bottom: '-6px',
                        width: 0,
                        height: 0,
                        borderRight: '5px solid transparent',
                        borderLeft: '5px solid transparent',
                        borderTop: `6px solid ${styleVars.dropdownBackgroundColor}`
                    }
                },
                menuOption: {
                    height: '37px',
                    width: '100%',
                    paddingTop: '11px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    ':hover': {
                        backgroundColor: '#ebe9e9'
                    }
                }
            }
        }
    }

    render () {
        const {activeMessageBox} = this.props

        const styles = this.getStyles()
        const messageTabs = this.getMessageTabs()
        const newMenu = this.getNewMenu()

        return (
            <Flexbox name="message-box-top-bar" container="row" justifyContent="flex-end" alignItems="center"
                     style={[styles.topBar, !isEmpty(activeMessageBox) && styles.topBar.active]}>
                <Flexbox name="message-tabs" grow={1} container="row">
                    {messageTabs}
                </Flexbox>
                <div name="message-new" style={styles.new}>
                    <div style={styles.new.button} key="new-button"><Icon name="plus" style={styles.new.icon} /> NEW</div>
                    {newMenu}
                </div>
            </Flexbox>
        )
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

module.exports = connect(mapStateToProps)(radium(MessageTabs))
