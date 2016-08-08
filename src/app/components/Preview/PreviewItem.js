const React = require('react')
const {Component, PropTypes} = React
const {getChildOfType, createSlots} = require('../../util/component-util')
const dateFns = require('date-fns')

const Flexbox = require('../UI/Flexbox')
const ThingStatus = require('../../../common/enums/thing-status')

const slots = createSlots('PreviewItemUser', 'PreviewItemTitle', 'PreviewItemText', 'PreviewItemActions')

const PreviewItemDate = ({date}) => {
    return <span>{dateFns.format(date, 'DD-MM-YYYY HH:mm')}</span>
}

const PreviewItemStatus = ({status}) => {
    return <span>{ThingStatus[status].label}</span>
}

PreviewItemDate.propTypes = {
    date: PropTypes.any.isRequired
}

PreviewItemStatus.propTypes = {
    status: PropTypes.string.isRequired
}

class PreviewItem extends Component {

    getUser() {
        return getChildOfType(this.props.children, slots.PreviewItemUser)
    }

    getTitle() {
        return getChildOfType(this.props.children, slots.PreviewItemTitle)
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
        const containerStyle = {
            backgroundColor: '#FAFAFA',
            marginBottom: '5px',
            paddingLeft: '30px',
            paddingRight: '30px'
        }

        return (
            <Flexbox grow={0} shrink={0} height='70px' container='row' style={containerStyle}>

                <Flexbox width='250px' grow={0} shrink={0} container='column' justifyContent="center">
                    <Flexbox>
                        {this.getUser()}
                    </Flexbox>
                    {statusPreview ? <Flexbox className="preview-item-status">{statusPreview}</Flexbox> : null}
                    <Flexbox>
                        {this.getDate()}
                    </Flexbox>
                </Flexbox>
                <Flexbox container="column" justifyContent="center" grow={1} style={{minWidth: 0}}>
                    <div>
                        {this.getTitle()}
                    </div>
                    <div>
                        {this.getPreviewText()}
                    </div>
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
    PreviewItemStatus
}, slots)
