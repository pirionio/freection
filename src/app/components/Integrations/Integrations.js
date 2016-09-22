import React, {Component} from 'react'
import useSheet from 'react-jss'
import Icon from 'react-fontawesome'

import Flexbox from '../UI/Flexbox'
import Link from '../UI/Link'

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
                <Link to="/integrations/slack" className={classes.link}>
                    <Icon name="slack" className={classes.icon} />
                    Slack
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
        fontSize: '1.4em',
        marginBottom: 15,
    },
    icon: {
        marginRight: 10
    }
}

export default useSheet(Integrations, style)
