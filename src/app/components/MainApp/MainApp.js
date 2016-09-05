const React = require('react')
const {Component} = React
const radium = require('radium')
const Flexbox = require('../UI/Flexbox')
const styleVars = require('../style-vars')

class MainApp extends Component {
    render () {
        const style = {
            container: {
                minWidth: 0,
                padding: '35px 35px 0 0',
                backgroundColor: styleVars.backgroundColor
            },
            content: {
                width: '100%',
                maxWidth: '1178px'
            },
            padding: {
                minWidth:'35px',
                maxWidth: '130px'
            }
        }

        return (
            <Flexbox name="main-app" grow={1} container="row" style={style.container} >
                <Flexbox name="main-app-padding" grow={1} style={style.padding} />
                <Flexbox name="main-app-content" container="column" style={style.content}>
                    {this.props.children}
                </Flexbox>
            </Flexbox>
        )
    }
}

MainApp.propTypes = {
}

module.exports = radium(MainApp)