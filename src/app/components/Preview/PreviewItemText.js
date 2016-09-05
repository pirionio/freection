const React = require('react')
const {Component} = React
const classAutobind = require('class-autobind').default
const SizeMe = require('react-sizeme').default
const autoprefixer = require('autoprefixer')
const postcssJs = require('postcss-js')
const prefixer = postcssJs.sync([autoprefixer])
const useSheet = require('react-jss').default

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

    render() {
        const {children} = this.props

        if (!children)
            return null

        const {sheet: {classes}} = this.props

        if (!this.fade)
            return React.Children.only(children)

        return (
            <div name="text-preview" className={classes.text}>
                {children}
                <div name="text-fade" className={classes.fade}></div>
            </div>
        )
    }
}

const style = {
    text: {
        position: 'relative'
    },
    fade: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 65,
        height: '100%',
        background: `linear-gradient(to right, rgba(255,255,255,0) 0%, ${styleVars.secondaryBackgroundColor} 80%, ${styleVars.secondaryBackgroundColor} 100%)`,
        pointerEvents: 'none'
    }
}

module.exports = useSheet(SizeMe()(PreviewItemText), style)