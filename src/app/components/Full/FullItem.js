const React = require('react')
const {Component, PropTypes} = React
const {getChildOfType, createSlots} = require('../../util/component-util')
const radium = require('radium')
const classAutobind = require('class-autobind').default
const clickOutside = require('react-click-outside')
const Delay = require('react-delay')
const Icon = require('react-fontawesome')

const Flexbox = require('../UI/Flexbox')
const Button = require('../UI/Button')
const CommentList = require('../Comment/CommentList')
const Ellipse = require('../UI/Ellipse')
const TextTruncate = require('../UI/TextTruncate')
const styleVars = require('../style-vars')

const {GeneralConstants} = require('../../constants')

const slots = createSlots('FullItemSubject', 'FullItemStatus', 'FullItemActions', 'FullItemBox')

class FullItem extends  Component {
    constructor(props) {
        super(props)
        classAutobind(this, FullItem.prototype)
    }

    componentDidMount() {
        // This is a patch - when clicking outside of the component, we attempt to close it.
        // But if the outside click was on a link that navigates to a different state, there's no need to close it (and it
        // might be buggy to try to).
        // So we save the initial path of the component, and use it to detect a state change before attempting to close.
        this.initialPath = window.location.pathname
    }

    handleClickOutside(event) {
        // This has to happen in a timeout, since we want to perform the check only after a potential state change,
        // which will happen in the next event-loop tick.
        setTimeout(() => {
            if (this.initialPath === window.location.pathname)
                this.props.close()
        })
    }

    getSubject() {
        return getChildOfType(this.props.children, slots.FullItemSubject)
    }

    getStatus() {
        const {circleColor} = this.props

        const status = getChildOfType(this.props.children, slots.FullItemStatus)
        return status ?
            <Flexbox name="full-item-circle" width='19px' shrink={0} container='column' justifyContent="center">
                <Ellipse width="8xp" height="8px" color={circleColor} />
            </Flexbox> :
            null
    }

    getActions() {
        const actions = getChildOfType(this.props.children, slots.FullItemActions)
        return actions ?
            <Flexbox name="full-item-actions">
                {actions}
            </Flexbox> :
            null
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
            </Flexbox>
        )
    }

    renderContent() {
        const {messages} = this.props

        const status = this.getStatus()
        const actions = this.getActions()

        const styles = this.getStyles()

        return (
            <Flexbox name="full-item-content" grow={1} container="column" style={styles.item}>
                <Flexbox name="full-item-navigation" container="row" alignItems="center" style={styles.navigation}>
                    <Flexbox name="prev-item" style={[styles.navigation.option, styles.navigation.prev]}>
                        <Icon name="chevron-left" style={styles.navigation.prev.arrow} />
                        <span>Previous</span>
                    </Flexbox>
                    <Flexbox name="next-item" style={[styles.navigation.option, styles.navigation.next]}>
                        <span>Next</span>
                        <Icon name="chevron-right" style={styles.navigation.next.arrow} />
                    </Flexbox>
                </Flexbox>
                <Flexbox name="full-item-header" container="row" alignItems="center" style={styles.header}>
                    {status}
                    <Flexbox name="full-item-subject" grow={1} style={styles.subject}>
                        <TextTruncate>{this.getSubject()}</TextTruncate>
                    </Flexbox>
                    {actions}
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
                position: 'absolute',
                top: -35,
                left: 40,
                right: 40,
                bottom: 0,
                zIndex: styleVars.fullItemZIndex,
                filter: 'none',
                boxShadow: '0px 0px 40px 0px rgba(0, 0, 0, 0.2)'
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
                marginTop: '10px'
            },
            close: {
                position: 'absolute',
                top: '25px',
                left: '-31px',
                fontSize: '2em',
                cursor: 'pointer'
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
                <Flexbox name="close" style={styles.close}>
                    <Icon name="times-circle" onClick={this.props.close} />
                </Flexbox>
            </Flexbox>
        )
    }
}

FullItem.propTypes = {
    messages: PropTypes.array.isRequired,
    isFetching: PropTypes.func.isRequired,
    isEmpty: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    circleColor: PropTypes.string
}

module.exports = Object.assign({
    FullItem: clickOutside(radium(FullItem))
}, slots)
