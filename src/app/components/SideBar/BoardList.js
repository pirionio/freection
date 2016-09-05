const React = require('react')
const {Component} = React
const classAutobind = require('class-autobind').default
const useSheet = require('react-jss').default

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

    getBoardRow({pathname, title, count}) {
        const {sheet: {classes}} = this.props

        const countCircle = count ?
            <Ellipse color={styleVars.greyCircleColor} text={count} oval={true} className={classes.circle} /> :
            null

        const arrow = window.location.pathname.startsWith(pathname) && <span className={classes.arrow} />

        return (
            <div name="link-container" key={pathname}>
                <Flexbox name="link-row" container="row" alignItems="center" className={classes.linkRow}>
                    <Flexbox name="link-title" grow={1} className={classes.linkTitle}>
                        <Link to={pathname} className={classes.link} activeClassName={classes.activeLink}>
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
        const {sheet: {classes}} = this.props

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
            <Flexbox name="boards-list-container" grow={1} container="column" className={classes.container}>
                <Flexbox name="boards-list-title" className={classes.title}>
                    Boards
                </Flexbox>
                {boards}
            </Flexbox>
        )
    }
}

const style = {
    container: {
        paddingLeft: 27
    },
    title: {
        width: 185,
        marginBottom: 25,
        paddingTop: 35,
        borderTop: '1px solid #232e34',
        color: styleVars.basePurpleColor,
        letterSpacing: '0.1em'
    },
    linkRow: {
        height: 25,
        marginBottom: 40,
        position: 'relative'
    },
    link: {
        fontFamily: 'Roboto Mono, monospace',
        fontSize: 0.7,
        fontWeight: 500,
        color: styleVars.menuTextColor,
        textDecoration: 'none',
        letterSpacing: '0.05em',
        '&:hover': {
            color: styleVars.highlightColor
        }
    },
    linkActive: {
        color: 'white'
    },
    linkTitle: {
        display: 'inline-block',
        minWidth: 0,
        marginRight: 10
    },
    circle: {
        width: 25,
        height: 20,
        marginRight: 26,
        paddingTop: 4,
        fontSize: 0.75,
        textAlign: 'center'
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

module.exports = useSheet(BoardList, style)