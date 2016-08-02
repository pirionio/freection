const React = require('react')
const {Component, PropTypes} = React
const {getChildOfType} = require('../../util/children-util')
const dateFns = require('date-fns')

const PreviewItemTitle = ({children}) => {
    return React.Children.only(children)
}

const PreviewItemDate = ({date}) => {
    return <span>{dateFns.format(date, 'DD-MM-YYYY HH:mm')}</span>
}

const PreviewItemText = ({children}) => {
    console.log(children)
    console.log(React.Children.only(children))
    return React.Children.only(children)
}

const PreviewItemUser = ({children}) => {
    return React.Children.only(children)
}

const PreviewItemActions = ({children}) => {
    return React.Children.only(children)
}

PreviewItemDate.propTypes = {
    date: PropTypes.any.isRequired
}

class PreviewItem extends Component {

    getUser() {
        return getChildOfType(this.props.children, PreviewItemUser)
    }

    getTitle() {
        return getChildOfType(this.props.children, PreviewItemTitle)
    }

    getDate() {
        return getChildOfType(this.props.children, PreviewItemDate)
    }

    getPreviewText() {
        return getChildOfType(this.props.children, PreviewItemText)
    }

    getActions() {
        return getChildOfType(this.props.children, PreviewItemActions)
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

module.exports = {PreviewItem, PreviewItemUser, PreviewItemTitle, PreviewItemDate, PreviewItemText, PreviewItemActions}