const React = require('react')
const {Component, PropTypes} = React
const {getChildOfType, createSlots} = require('../../util/component-util')
const dateFns = require('date-fns')
const radium = require('radium')
const Color = require('color')

const Flexbox = require('../UI/Flexbox')
const Ellipse = require('../UI/Ellipse')
const styleVars = require('../style-vars')

const slots = createSlots('PreviewItemUser', 'PreviewItemText', 'PreviewItemActions')

const PreviewItemDate = ({date}) => {
    const time = dateFns.format(date, 'HH:mm')

    if (dateFns.isToday(date)) {
        return <span>Today at {time}</span>
    } else if (dateFns.isYesterday(date)) {
        return <span>Yesterday at {time}</span>
    } else {
        return <span>{dateFns.format(date, 'DD MMM YYYY')} at {time}</span>
    }
}

const PreviewItemTitle = ({title, onClick, href}) => {
    const style = {
        color: 'black',
        cursor: 'pointer',
        textDecoration: 'none',
        lineHeight: 1.571
    }

    return <a style={style} onClick={onClick} href={href} target="blank"><strong>{title}</strong></a>
}

const PreviewItemStatus = ({status, children}) => {
    if (status)
        return <span>{status}</span>

    return React.Children.only(children)
}

PreviewItemDate.propTypes = {
    date: PropTypes.any.isRequired
}

PreviewItemStatus.propTypes = {
    status: PropTypes.string
}

PreviewItemTitle.propTypes = {
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    href: PropTypes.string
}

class PreviewItem extends Component {

    getUser() {
        return getChildOfType(this.props.children, slots.PreviewItemUser)
    }

    getTitle() {
        return getChildOfType(this.props.children, PreviewItemTitle)
    }

    getDate() {
        return getChildOfType(this.props.children, PreviewItemDate)
    }

    getPreviewText() {
        return getChildOfType(this.props.children, slots.PreviewItemText)
    }

    getActions() {
        const original = getChildOfType(this.props.children, slots.PreviewItemActions)
        const isRollover = radium.getState(this.state, 'preview', ':hover')
        return React.cloneElement(original, {isRollover: isRollover})
    }

    getStatus() {
        return getChildOfType(this.props.children, PreviewItemStatus)
    }

    render() {
        const statusPreview = this.getStatus()
        const textPreview = this.getPreviewText()
        const {circleColor} = this.props

        const styles = {
            hoverable: {
                width: '100%',
                ':hover': {
                    backgroundColor: 'lightgrey'
                }
            },
            container: {
                backgroundColor: '#FAFAFA',
                marginBottom: '5px',
                paddingLeft: '30px',
                paddingRight: '30px',
                borderColor: 'e0e0e0',
                borderStyle: 'solid',
                borderWidth: '1px'
            },
            text: {
                lineHeight: styleVars.previewLineHeight
            },
            status: {
                lineHeight: styleVars.previewLineHeight
            },
            date:{
                color: styleVars.baseGrayColor,
                lineHeight: styleVars.previewLineHeight
            }
        }

        return (
            <div style={styles.hoverable} key="preview">
                <Flexbox shrink={0} height='70px' container='row' style={styles.container}>
                    { circleColor ? <Flexbox width='19px' shrink={0} container='column' justifyContent="center">
                        <Ellipse width="8xp" height="8px" color={circleColor} />
                    </Flexbox> : null }
                    <Flexbox width='274px' shrink={0} container='column' justifyContent="center">
                        <Flexbox style={styles.status}>{statusPreview}</Flexbox>
                        <Flexbox style={styles.date}>
                            {this.getDate()}
                        </Flexbox>
                    </Flexbox>
                    <Flexbox container="column" justifyContent="center" grow={1} style={{minWidth: 0}}>
                        <Flexbox>
                            {this.getTitle()}
                        </Flexbox>

                        {textPreview ? <Flexbox style={styles.text}>{textPreview}</Flexbox> : null}
                    </Flexbox>
                    <Flexbox container="column" justifyContent="center" shrink={0} width='250px'>
                        {this.getActions()}
                    </Flexbox>
                </Flexbox>
            </div>
        )
    }
}

PreviewItem.propTypes = {
    circleColor: PropTypes.string
}

module.exports = Object.assign({
    PreviewItem: radium(PreviewItem),
    PreviewItemDate,
    PreviewItemStatus,
    PreviewItemTitle
}, slots)
