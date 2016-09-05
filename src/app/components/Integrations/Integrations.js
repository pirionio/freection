const React = require('react')
const {Component} = React
const useSheet = require('react-jss').default

const Flexbox = require('../UI/Flexbox')
const Icon = require('react-fontawesome')
const Link = require('../UI/Link')

class Integrations extends Component {
    render() {
        const {sheet: {classes}} = this.props

        return (
            <Flexbox name="integrations-container" grow={1} container="column">
                <span className={classes.title}>These are the integrations we offer right now:</span>
                <Link to="/integrations/github" className={classes.link}>
                    <Icon name="github" className={classes.icon} />
                    Github
                </Link>
            </Flexbox>
        )
    }
}

const style = {
    title: {
        marginBottom: 15,
        color: 'black',
        fontSize: '1.4em'
    },
    link: {
        color: 'black',
        fontSize: '1.4em'
    },
    icon: {
        marginRight: 10
    }
}

module.exports = useSheet(Integrations, style)
