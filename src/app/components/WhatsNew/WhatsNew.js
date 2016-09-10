import React, {Component} from 'react'
import useSheet from 'react-jss'

import Link from '../UI/Link'
import Flexbox from '../UI/Flexbox'

class WhatsNew extends Component {
    render() {
        const {sheet: {classes}} = this.props

        return (
            <Flexbox name="whats-new-container" grow={1} container="column" className={classes.container}>
                <Flexbox name="whats-new-menu" shrink={0} alignItems="flex-start" className={classes.menu}>
                    <Link to="/whatsnew/things" className={classes.link} activeClassName={classes.activeLink}>
                        Things
                    </Link>
                    <Link to="/whatsnew/emails" className={classes.link} activeClassName={classes.activeLink}>
                        Emails
                    </Link>
                </Flexbox>
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

export default useSheet(WhatsNew, style)