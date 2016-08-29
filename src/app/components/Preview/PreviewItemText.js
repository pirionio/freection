const React = require('react')
const {Component} = React
const radium = require('radium')
const classAutobind = require('class-autobind').default
const SizeMe = require('react-sizeme').default
const autoprefixer = require('autoprefixer')
const postcssJs = require('postcss-js')
const prefixer = postcssJs.sync([autoprefixer])

const styleVars = require('../style-vars')

class PreviewItemText extends Component {
    constructor(props) {
        super(props)
        this.fade = false
        classAutobind(this, PreviewItemText.prototype)
    }

    componentWillUpdate(nextProps) {
        // This is the reason the preview-text must be a component - we want to detect changes in its size, and show the fade effect
        // only if the text had gone narrower (i.e. something push or overlay it, and it therefore needs the fade).
        this.fade = (nextProps.size.width < this.props.size.width)
    }

    getStyles() {
        return {
            text: {
                position: 'relative'
            },
            fade: prefixer({
                position: 'absolute',
                top: 0,
                right: 0,
                width: '65px',
                height: '100%',
                background: `linear-gradient(to right, rgba(255,255,255,0) 0%, ${styleVars.secondaryBackgroundColor} 80%, ${styleVars.secondaryBackgroundColor} 100%)`,
                pointerEvents: 'none'
            })
        }
    }

    render() {
        const styles = this.getStyles()

        if (!this.fade)
            return React.Children.only(this.props.children)

        return (
            <div name="text-preview" style={styles.text}>
                {this.props.children}
                <div name="text-fade" style={styles.fade}></div>
            </div>
        )
    }
}

module.exports = SizeMe()(radium(PreviewItemText))