const React = require('react')
const {Component} = React
const classAutobind = require('class-autobind').default

const Link = require('../UI/Link')
const Flexbox = require('../UI/Flexbox')
const Ellipse = require('../UI/Ellipse')
const TextTruncate = require('../UI/TextTruncate')
const styleVars = require('../style-vars')

class BoardList extends  Component {
    constructor(props) {
        super(props)
        classAutobind(this, BoardList.prototype)
    }

    getStyles() {
        return {
            container: {
                paddingLeft: 27
            },
            title: {
                width: '185px',
                marginBottom: '25px',
                paddingTop: '35px',
                borderTop: '1px solid #232e34',
                color: styleVars.basePurpleColor,
                letterSpacing: '0.1em'
            },
            linkRow: {
                height: '25px',
                marginBottom: '40px',
                position: 'relative'
            },
            link: {
                fontFamily: 'Roboto Mono, monospace',
                fontSize: '0.75em',
                fontWeight: 500,
                color: styleVars.menuTextColor,
                textDecoration: 'none',
                letterSpacing: '0.05em',
                ':hover': {
                    color: styleVars.highlightColor
                },
                active: {
                    color: 'white'
                }
            },
            linkTitle: {
                display: 'inline-block',
                minWidth: '0',
                marginRight: '10px'
            },
            circle: {
                marginRight: '26px',
                paddingTop: '4px',
                fontSize: '0.75em',
                textAlign: 'center',
                borderBottomLeftRadius: '100%30px',
                borderBottomRightRadius: '100%30px',
                borderTopLeftRadius: '100%30px',
                borderTopRightRadius: '100%30px'
            },
            arrow: {
                position: 'absolute',
                right: 0,
                top: 8,
                width: 0,
                height: 0,
                borderTop: '5px solid transparent',
                borderBottom: '5px solid transparent',
                borderRight: `6px solid ${styleVars.backgroundColor}`
            }
        }
    }

    getBoardRow({pathname, title, count}) {
        const styles = this.getStyles()

        const countCircle = count ?
            <Ellipse width="25px" height="20px" color={styleVars.greyCircleColor} text={count} style={styles.circle} /> :
            null

        const arrow = window.location.pathname.startsWith(pathname) && <span style={styles.arrow} />

        return (
            <div name="link-container" key={pathname}>
                <Flexbox name="link-row" container="row" alignItems="center" style={styles.linkRow}>
                    <Flexbox name="link-title" grow={1} style={styles.linkTitle}>
                        <Link to={pathname} style={styles.link} activeStyle={styles.link.active}>
                            <TextTruncate>{title}</TextTruncate>
                        </Link>
                    </Flexbox>
                    <Flexbox name="link-count">
                        {countCircle}
                    </Flexbox>
                    {arrow}
                </Flexbox>
            </div>
        )
    }

    render() {
        const styles = this.getStyles()

        const boards = [
            {
                pathname: '/boards/demo-board1',
                title: 'AngularJS or React?',
                count: 2
            },
            {
                pathname: '/boards/demo-board2',
                title: 'New stage in the funnel',
                count: 0
            },
            {
                pathname: '/boards/demo-board3',
                title: 'Integrating SalesForce with Redash',
                count: 7
            }
        ].map(this.getBoardRow)


        return (
            <Flexbox name="boards-list-container" grow={1} container="column" style={styles.container}>
                <Flexbox name="boards-list-title" style={styles.title}>
                    Boards
                </Flexbox>
                {boards}
            </Flexbox>
        )
    }
}

module.exports = BoardList