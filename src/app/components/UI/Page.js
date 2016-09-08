import React, {Component, PropTypes} from 'react'
import DocumentTitle from 'react-document-title'
import useSheet from 'react-jss'
import classNames from 'classnames'

import Flexbox from './Flexbox'

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

export default useSheet(Page, style)


