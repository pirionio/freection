const React = require('react')
const {Component, PropTypes} = React
const {getChildOfType, createSlots} = require('../../util/component-util')
const dateFns = require('date-fns')

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
        console.log(statusPreview)

        return (
            <div className="preview-item">
                <div className="preview-item-content">
                    <div className="row">
                        <div className="preview-item-user">
                            {this.getUser()}
                        </div>
                        <div className="preview-item-title">
                            {this.getTitle()}
                        </div>
                        {statusPreview ? <div className="preview-item-status">{statusPreview}</div> : null}
                        <div className="preview-item-date">
                            {this.getDate()}
                        </div>
                    </div>
                    <div className="row">
                        <div className="preview-item-text">
                            {this.getPreviewText()}
                        </div>
                    </div>
                </div>
                <div className="preview-item-actions">
                    {this.getActions()}
                </div>
            </div>
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
