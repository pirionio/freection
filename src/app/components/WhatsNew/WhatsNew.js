const React = require('react')
const {Component, PropTypes} = React

const Link = require('../UI/Link')
const Flexbox = require('../UI/Flexbox')

class WhatsNew extends Component {
    getStyles() {
        return {
            container: {
            },
            menu: {
                height: '30px',
                paddingBottom: '15px',
                borderBottom: '1px solid #d7d7d7',
                marginBottom: '22px'
            },
            menuItem: {
            },
            link: {
                paddingBottom: '12px',
                marginRight: '33px',
                color: 'black',
                textDecoration: 'none'
            },
            activeLink: {
                fontWeight: '600',
                borderBottom: '2px solid #36474f'
            }
        }
    }

    render() {
        const styles = this.getStyles()

        return (
            <Flexbox name="whats-new-container" grow={1} container="column" style={styles.container}>
                <Flexbox name="whats-new-menu" shrink={0} style={styles.menu} alignItems="flex-start">
                    <Link to="/whatsnew/things" style={styles.link} activeStyle={styles.activeLink}>
                        Things
                    </Link>
                    <Link to="/whatsnew/emails" style={styles.link} activeStyle={styles.activeLink}>
                        Emails
                    </Link>
                </Flexbox>
                {this.props.children}
            </Flexbox>
        )
    }
}

module.exports = WhatsNew