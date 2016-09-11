import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import useSheet from 'react-jss'

import Link from '../UI/Link'
import Flexbox from '../UI/Flexbox'

class WhatsNew extends Component {
    render() {
        const {config, sheet: {classes}} = this.props

        // Don't show the menu in demos for now - we to keep emails out of focus.
        const menu = !config.isDemo ?
            <Flexbox name="whats-new-menu" shrink={0} alignItems="flex-start" className={classes.menu}>
                <Link to="/whatsnew/things" className={classes.link} activeClassName={classes.activeLink}>
                    Things
                </Link>
                <Link to="/whatsnew/emails" className={classes.link} activeClassName={classes.activeLink}>
                    Emails
                </Link>
            </Flexbox> :
            null

        return (
            <Flexbox name="whats-new-container" grow={1} container="column" className={classes.container}>
                {menu}
                {this.props.children}
            </Flexbox>
        )
    }
}

const style = {
    container: {
        position: 'relative'
    },
    menu: {
        height: 30,
        paddingBottom: 15,
        borderBottom: '1px solid #d7d7d7',
        marginBottom: 22
    },
    menuItem: {
    },
    link: {
        paddingBottom: 12,
        marginRight: 33,
        color: 'black',
        textDecoration: 'none'
    },
    activeLink: {
        fontWeight: '600',
        borderBottom: '2px solid #36474f'
    }
}

WhatsNew.propTypes = {
    config: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        config: state.config
    }
}

export default useSheet(connect(mapStateToProps)(WhatsNew), style)