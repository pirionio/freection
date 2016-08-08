const React = require('react')
const {Component, PropTypes} = React
const DocumentTitle = require('react-document-title')
const radium = require('radium')

class Page extends Component {
    render() {
        const {title, style, children} = this.props

        return (
            <div style={[
                {width: '100%', height: '100%'},
                style
            ]}>
                <DocumentTitle title={title} />
                {children}
            </div>
        )
    }
}
Page.propTypes = {
    title: PropTypes.string,
    style: PropTypes.object
}
Page.defaultProps = {
    title: ''
}

module.exports = radium(Page)


