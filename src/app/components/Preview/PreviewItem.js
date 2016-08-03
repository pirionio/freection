const React = require('react')
const {Component, PropTypes} = React
const {getChildOfType, createSlots} = require('../../util/component-util')
const dateFns = require('date-fns')

const slots = createSlots('PreviewItemUser', 'PreviewItemTitle', 'PreviewItemText', 'PreviewItemActions')

const PreviewItemDate = ({date}) => {
    return <span>{dateFns.format(date, 'DD-MM-YYYY HH:mm')}</span>
}

PreviewItemDate.propTypes = {
    date: PropTypes.any.isRequired
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

    render() {
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
    PreviewItemDate
}, slots)
