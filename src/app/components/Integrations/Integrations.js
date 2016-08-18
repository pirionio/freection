const React = require('react')
const {Component} = React

const Flexbox = require('../UI/Flexbox')
const Icon = require('react-fontawesome')
const Link = require('../UI/Link')

class Integrations extends Component {
    render() {
        const styles = {
            title: {
                marginBottom: '15px',
                color: 'black',
                fontSize: '1.4em'
            },
            link: {
                color: 'black',
                fontSize: '1.4em'
            },
            icon: {
                marginRight: '10px'
            }
        }

        return (
            <Flexbox name="integrations-container" grow={1} container="column">
                <span style={styles.title}>These are the integrations we offer right now:</span>
                <Link to="/integrations/github" style={styles.link}>
                    <Icon name="github" style={styles.icon} />
                    Github
                </Link>
            </Flexbox>
        )
    }
}

module.exports = Integrations