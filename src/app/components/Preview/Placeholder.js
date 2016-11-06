import React, {Component, PropTypes} from 'react'
import useSheet from 'react-jss'

import Flexbox from '../UI/Flexbox'
import styleVars from '../style-vars'
import SunImage from '../../static/Sun.png'
import Logo from '../../static/logo-grey.png'

class Placeholder extends Component {
    render() {
        const {title, subTitle, sheet: {classes}} = this.props

        return (
            <Flexbox name="placeholder-container" container="column" alignItems="center">
                <Flexbox name="placeholder-image" className={classes.image}>
                    <img src={SunImage} />
                </Flexbox>
                <Flexbox name="placeholder-title" className={classes.title}>
                    {title}
                </Flexbox>
                <Flexbox name="placeholder-subtitle" className={classes.subTitle}>
                    {subTitle}
                </Flexbox>
                <Flexbox name="placeholder-logo" className={classes.logo}>
                    <img src={Logo} />
                </Flexbox>
            </Flexbox>
        )
    }
}

const styles = {
    image: {
        height: 115,
        width: 115,
        marginBottom: 46
    },
    title: {
        fontSize: '1.286em',
        letterSpacing: '0.2em',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: '#7f8b91',
        marginBottom: 23
    },
    subTitle: {
        letterSpacing: '0.05em',
        color: '#7f8b91',
        marginBottom: 52
    },
    logo: {
        '& img': {
            height: 13,
            width: 44
        }
    }
}

Placeholder.propTypes = {
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string.isRequired
}

export default useSheet(Placeholder, styles)