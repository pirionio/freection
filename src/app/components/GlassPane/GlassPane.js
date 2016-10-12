import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'
import classNames from 'classnames'
import find from 'lodash/find'

import * as GlassPaneActions from '../../actions/glass-pane-actions'
import styleVars from '../style-vars'

class GlassPane extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, GlassPane.prototype)
    }

    close() {
        const backdropCallback = this.getGlassPane().backdropCallback

        if (backdropCallback) {
            backdropCallback()

            const {dispatch} = this.props
            dispatch(GlassPaneActions.hide())
        }
    }

    getGlassPane() {
        return find(this.props.glassPanes, {id: this.props.name})
    }

    shouldShow() {
        const glassPane = this.getGlassPane()
        return glassPane && glassPane.show
    }

    render() {
        const {sheet: {classes}} = this.props
        const glassPaneClass = classNames(classes.glassPane, !this.shouldShow() && classes.hide)
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
        left: 0,
        right: 0,
        backgroundColor: styleVars.glassPaneColor,
        zIndex: styleVars.backZIndex,
        display: 'block'
    },
    hide: {
        display: 'none'
    }
}

GlassPane.propTypes = {
    name: PropTypes.string.isRequired,
    glassPanes: PropTypes.array.isRequired
}

function mapStateToProps(state) {
    return {
        glassPanes: state.glassPane.glassPanes
    }
}

export default useSheet(connect(mapStateToProps)(GlassPane), style)
