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
                padding: '35px 0 50px 0',
                backgroundColor: styleVars.backgroundColor
            },
            content: {
                width: '100%',
                maxWidth: '1178px'
            }
        }

        return (
            <Flexbox name="main-app" grow={1} height='100%' style={style.container} container={true}>
                <Flexbox grow={1} style={{minWidth:'35px', maxWidth: '130px'}} />
                <Flexbox style={style.content}>
                    {this.props.children}
                </Flexbox>
            </Flexbox>
        )
    }
}

MainApp.propTypes = {
}

module.exports = radium(MainApp)