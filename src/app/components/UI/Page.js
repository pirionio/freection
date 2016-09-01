const React = require('react')
const {Component, PropTypes} = React
const DocumentTitle = require('react-document-title')

const Flexbox = require('./Flexbox')

class Page extends Component {
    render() {
        const {title, style, children} = this.props

        return (
            <Flexbox grow={1} container="column" style={[{width: '100%'}, style]}>
                <DocumentTitle title={title} />
                {children}
            </Flexbox>
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

module.exports = Page


