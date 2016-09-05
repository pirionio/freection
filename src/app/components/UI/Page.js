const React = require('react')
const {Component, PropTypes} = React
const DocumentTitle = require('react-document-title')
const useSheet = require('react-jss').default
const classNames = require('classnames')

const Flexbox = require('./Flexbox')

class Page extends Component {
    render() {
        const {title, className, children, sheet: {classes}} = this.props

        const containerClassName = classNames(classes.container, className)

        return (
            <Flexbox grow={1} container="column" className={containerClassName}>
                <DocumentTitle title={title} />
                {children}
            </Flexbox>
        )
    }
}

const style = {
    container: {
        width: '100%'
    }
}

Page.propTypes = {
    title: PropTypes.string,
    className: PropTypes.string
}

Page.defaultProps = {
    title: ''
}

module.exports = useSheet(Page, style)


