const React = require('react')
const {Component, PropTypes} = React
const {getChildOfType, createSlots} = require('../../util/component-util')
const classAutobind = require('class-autobind').default
const Delay = require('react-delay')

const Flexbox = require('../UI/Flexbox')
const Button = require('../UI/Button')
const CommentList = require('../Comment/CommentList')
const styleVars = require('../style-vars')

const {GeneralConstants} = require('../../constants')

const slots = createSlots('FullItemSubject', 'FullItemStatus', 'FullItemActions', 'FullItemUser', 'FullItemDate', 'FullItemBox')

class FullItem extends  Component {
    constructor(props) {
        super(props)
        classAutobind(this, FullItem.prototype)
    }
    getSubject() {
        return getChildOfType(this.props.children, slots.FullItemSubject)
    }

    getStatus() {
        return getChildOfType(this.props.children, slots.FullItemStatus)
    }

    getActions() {
        return getChildOfType(this.props.children, slots.FullItemActions)
    }

    getUser() {
        return getChildOfType(this.props.children, slots.FullItemUser)
    }

    getDate() {
        return getChildOfType(this.props.children, slots.FullItemDate)
    }

    getBox() {
        return getChildOfType(this.props.children, slots.FullItemBox)
    }


    renderFetching() {
        const styles = this.getStyles()

        return (
            <Flexbox name="full-item-content" grow={1} container="row" justifyContent="flex-end" style={styles.item}>
                <Flexbox grow={1}>
                    <Delay wait={GeneralConstants.FETCHING_DELAY_MILLIS}>
                        <div className="full-item-loading">
                            Loading, please wait.
                        </div>
                    </Delay>
                </Flexbox>
                <Flexbox name="full-item-close">
                    <Button label="Back" onClick={this.props.close} style={styles.button} />
                </Flexbox>
            </Flexbox>
        )
    }

    renderError() {
        const styles = this.getStyles()

        return (
            <Flexbox name="full-item-content" grow={1} container="row" justifyContent="flex-end" style={styles.item}>
                <Flexbox name="full-item-error" grow={1}>
                    We are sorry, the item could not be displayed!
                </Flexbox>
                <Flexbox name="full-item-close">
                    <Button label="Back" onClick={this.props.close} style={styles.button} />
                </Flexbox>
            </Flexbox>
        )
    }

    renderContent() {
        const {messages} = this.props

        const showStatus = this.getStatus()
        const showActions = this.getActions()

        const styles = this.getStyles()

        return (
            <Flexbox name="full-item-content" grow={1} container="column" style={styles.item}>
                <Flexbox name="full-item-header" style={styles.header}>
                    <Flexbox name="full-item-header-row" container="row" alignItems="center" style={styles.headerRow}>
                        <Flexbox grow={1} container="row" style={{minWidth: 0}}>
                            <Flexbox name="full-item-subject" style={styles.subject}>
                                {this.getSubject()}
                            </Flexbox>
                            {showStatus ? <Flexbox name="full-item-status" style={styles.status}>{this.getStatus()}</Flexbox> : null}
                        </Flexbox>
                        {showActions ? <Flexbox name="full-item-actions">{this.getActions()}</Flexbox> : null}
                        <Flexbox name="full-item-close" style={styles.close}>
                            <Button label="Back" onClick={this.props.close} style={styles.button} />
                        </Flexbox>
                    </Flexbox>
                </Flexbox>
                <Flexbox name="full-item-sub-header" style={styles.header}>
                    <Flexbox name="full-item-header-row" container="row" alignItems="center">
                        <Flexbox name="full-item-user" grow={1}>
                            {this.getUser()}
                        </Flexbox>
                        <Flexbox name="full-item-creation-time">
                            {this.getDate()}
                        </Flexbox>
                    </Flexbox>
                </Flexbox>
                <Flexbox name="full-item-body-container" grow={1} container="column" style={styles.content}>
                    <CommentList comments={messages} />
                </Flexbox>
            </Flexbox>
        )
    }

    getStyles() {
        return {
            page: {
                height: '100%'
            },
            item: {
                marginBottom: '15px'
            },
            header: {
                height: '40px',
                padding: '0 10px',
                backgroundColor: '#36474f',
                color: 'white'
            },
            headerRow: {
                height: '100%'
            },
            subject: {
                fontWeight: 'bold',
                minWidth: 0
            },
            status: {
                width: '150px',
                paddingLeft: '10px'
            },
            content: {
                height: '100%',
                overflowY: 'hidden',
                marginTop: '10px'
            },
            button: {
                backgroundColor: styleVars.highlightColor,
                color: styleVars.primaryColor,
                ':hover': {
                    color: 'white'
                }
            }
        }
    }

    render() {
        const {isFetching, isEmpty} = this.props

        let content
        if (isFetching())
            content = this.renderFetching()
        else if (isEmpty())
            content = this.renderError()
        else
            content = this.renderContent()

        const styles = this.getStyles()

        return (
            <Flexbox name="full-item-page" container="column" style={styles.page}>
                {content}
                {this.getBox()}
            </Flexbox>
        )
    }
}

FullItem.propTypes = {
    messages: PropTypes.array.isRequired,
    isFetching: PropTypes.func.isRequired,
    isEmpty: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
}

module.exports = Object.assign({
    FullItem
}, slots)
