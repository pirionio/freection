const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const classAutobind = require('class-autobind').default
const useSheet = require('react-jss').default
const classNames = require('classnames')

import * as GlassPaneActions from '../../actions/glass-pane-actions'

const styleVars = require('../style-vars')

class GlassPane extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, GlassPane.prototype)
    }

    close() {
        if (this.props.backdropCallback) {
            this.props.backdropCallback()

            const {dispatch} = this.props
            dispatch(GlassPaneActions.hide())
        }
    }

    render() {
        const {show, sheet: {classes}} = this.props
        const glassPaneClass = classNames(classes.glassPane, !show && classes.hide)
        return (
            <div className={glassPaneClass} onClick={this.close}></div>
        )
    }
}

const style = {
    glassPane: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        height: '100%',
        width: '100%',
        opacity: 0.2,
        backgroundColor: 'grey',
        zIndex: styleVars.backZIndex,
        display: 'block'
    },
    hide: {
        display: 'none'
    }
}

GlassPane.propTypes = {
    show: PropTypes.bool.isRequired,
    backdropCallback: PropTypes.func
}

function mapStateToProps(state) {
    return {
        show: state.glassPane.show,
        backdropCallback: state.glassPane.backdropCallback
    }
}

module.exports = useSheet(connect(mapStateToProps)(GlassPane), style)
