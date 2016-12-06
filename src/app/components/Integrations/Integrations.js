import React, {Component} from 'react'
import useSheet from 'react-jss'
import Icon from 'react-fontawesome'
import classAutobind from 'class-autobind'

import Flexbox from '../UI/Flexbox'
import Link from '../UI/Link'
import AsanaLogoBlack from '../../static/AsanaLogoBlack.png'


class Integrations extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, Integrations.prototype)
    }

    render() {
        const {sheet: {classes}} = this.props

        return (
            <Flexbox name="integrations-container" grow={1} container="column">
                <span className={classes.title}>These are the integrations we offer right now:</span>
                <Link to="/integrations/github" className={classes.link}>
                    <Icon name="github" className={classes.icon} />
                    Github
                </Link>
                <Link to="/integrations/asana" className={classes.link}>
                    <img name="asana" src={AsanaLogoBlack} className={classes.logo} />
                    Asana
                </Link>
                <Link to="/integrations/slack" className={classes.link}>
                    <Icon name="slack" className={classes.icon} />
                    Slack
                </Link>
                <Link to="/integrations/gmail" className={classes.link}>
                    <Icon name="envelope" className={classes.icon} />
                    Gmail
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
        marginBottom: 15
    },
    icon: {
        marginRight: 10
    },
    logo: {
        marginRight: 10,
        width:19,
        height:18
    },
}

export default useSheet(Integrations, style)
