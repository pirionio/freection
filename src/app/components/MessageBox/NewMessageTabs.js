const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const classAutobind = require('class-autobind').default
const radium = require('radium')

const MessageBoxActions = require('../../actions/message-box-actions')
const MessageTypes = require('../../../common/enums/message-types')

const Flexbox = require('../UI/Flexbox')
const TextTruncate = require('../UI/TextTruncate')
const styleVars = require('../style-vars')

class NewMessageTabs extends Component {
    constructor(props) {
        super(props)
        classAutobind(this)
    }

    selectMessageBox(selectedMessageBox) {
        const {dispatch, activeMessageBox} = this.props
        dispatch(MessageBoxActions.selectMessageBox(activeMessageBox, selectedMessageBox))
    }

    getMessageTabs() {
        const {messageBoxes, activeMessageBox} = this.props
        const styles = this.getStyles()
        return messageBoxes.map(messageBox =>
            <Flexbox key={messageBox.id} container="row" alignItems="center"
                     style={[styles.tab, activeMessageBox.id === messageBox.id && styles.tab.active]}>
                <a onClick={() => this.selectMessageBox(messageBox)} style={styles.tab.link}>
                    <TextTruncate>{messageBox.title}</TextTruncate>
                </a>
            </Flexbox>
        )
    }

    newThingMessageBox() {
        const {dispatch} = this.props
        dispatch(MessageBoxActions.newMessage(MessageTypes.NEW_THING))
    }

    newEmailMessageBox() {
        const {dispatch} = this.props
        dispatch(MessageBoxActions.newMessage(MessageTypes.NEW_EMAIL))
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
            </div>
        )
    }

    getStyles() {
        return {
            topBar: {
                height: '37px',
                backgroundColor: styleVars.primaryColor
            },
            tab: {
                height: '100%',
                maxWidth: '150px',
                color: 'white',
                padding: '0 16px',
                active: {
                    backgroundColor: styleVars.highlightColor,
                    color: styleVars.primaryColor
                },
                link: {
                    cursor: 'pointer'
                }
            },
            new: {
                position: 'relative',
                button: {
                    height: '100%',
                    lineHeight: '37px',
                    width: '115px',
                    backgroundColor: '#3b4b54',
                    color: 'white',
                    border: `1px solid ${styleVars.primaryColor}`,
                    outline: 'none',
                    textAlign: 'center',
                    cursor: 'default',
                    ':hover': {}
                },
                menu: {
                    position: 'absolute',
                    height: '75px',
                    width: '115px',
                    backgroundColor: '#fafafa',
                    border: '1px solid #e0e0e0',
                    ':hover': {}
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
        const styles = this.getStyles()
        const messageTabs = this.getMessageTabs()
        const newMenu = this.getNewMenu()

        return (
            <Flexbox name="message-box-top-bar" container="row" justifyContent="flex-end" alignItems="center" style={styles.topBar}>
                <Flexbox name="message-tabs" grow={1} container="row">
                    {messageTabs}
                </Flexbox>
                <div name="message-new" style={styles.new}>
                    <div style={styles.new.button} key="new-button">+ new</div>
                    {newMenu}
                </div>
            </Flexbox>
        )
    }
}

NewMessageTabs.propTypes = {
    messageBoxes: PropTypes.array.isRequired,
    activeMessageBox: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        messageBoxes: state.newMessagePanel.messageBoxes,
        activeMessageBox: state.newMessagePanel.activeMessageBox
    }
}

module.exports = connect(mapStateToProps)(radium(NewMessageTabs))
