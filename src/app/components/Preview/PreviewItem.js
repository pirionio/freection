const React = require('react')
const {Component, PropTypes} = React
const {getChildOfType, createSlots} = require('../../util/component-util')
const dateFns = require('date-fns')
const Color = require('color')

const Flexbox = require('../UI/Flexbox')

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
        fontWeight: 'bold',
        cursor: 'pointer',
        textDecoration: 'none'
    }

    return <a style={style} onClick={onClick} href={href}>{title}</a>
}

const PreviewItemStatus = ({status}) => {
    return <span>{status}</span>
}

PreviewItemDate.propTypes = {
    date: PropTypes.any.isRequired
}

PreviewItemStatus.propTypes = {
    status: PropTypes.string.isRequired
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
        return getChildOfType(this.props.children, slots.PreviewItemActions)
    }

    getStatus() {
        return getChildOfType(this.props.children, PreviewItemStatus)
    }

    render() {
        const statusPreview = this.getStatus()
        const textPreview = this.getPreviewText()
        const containerStyle = {
            backgroundColor: '#FAFAFA',
            marginBottom: '5px',
            paddingLeft: '30px',
            paddingRight: '30px',
            borderColor: Color('rgb(233,234,236)').hexString(),
            borderStyle: 'outset',
            borderWidth: '1px'
        }

        const textStyle = {
            marginTop: '10px'
        }

        return (
            <Flexbox grow={0} shrink={0} height='70px' container='row' style={containerStyle}>

                <Flexbox width='250px' grow={0} shrink={0} container='column' justifyContent="space-around">
                    <Flexbox>
                        {this.getUser()}
                    </Flexbox>
                    <Flexbox>
                        {this.getDate()}
                    </Flexbox>
                    {statusPreview ? <Flexbox className="preview-item-status">{statusPreview}</Flexbox> : null}
                </Flexbox>
                <Flexbox container="column" justifyContent="center" grow={1} style={{minWidth: 0}}>
                    <div>
                        {this.getTitle()}
                    </div>
                    {textPreview ? <div style={textStyle}>{textPreview}</div> : null}
                </Flexbox>
                <Flexbox container="column" justifyContent="center" grow={0} shrink={0} width='250px'>
                    {this.getActions()}
                </Flexbox>
            </Flexbox>
        )
    }
}

PreviewItem.propTypes = {
}

module.exports = Object.assign({
    PreviewItem,
    PreviewItemDate,
    PreviewItemStatus,
    PreviewItemTitle
}, slots)
