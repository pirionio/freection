const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const radium = require('radium')
const classAutobind = require('class-autobind').default

const GlassPaneActions = require('../../actions/glass-pane-actions')

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
        const styles = {
            glassPane: {
                position: 'absolute',
                top: '0',
                bottom: '0',
                height: '100%',
                width: '100%',
                opacity: '0.2',
                backgroundColor: 'grey',
                zIndex: styleVars.backZIndex,
                display: 'block'
            },
            hide: {
                display: 'none'
            }
        }
        
        return (
            <div style={[styles.glassPane, !this.props.show && styles.hide]} onClick={this.close}></div>
        )
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

module.exports = connect(mapStateToProps)(radium(GlassPane))
