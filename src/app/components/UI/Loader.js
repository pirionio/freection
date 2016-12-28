import React from 'react'
import Delay from 'react-delay'
import useSheet from 'react-jss'
import classNames from 'classnames'

import styleVars from '../style-vars'
import {GeneralConstants} from '../../constants'
import Flexbox from './Flexbox'
import LoaderImage from '../../static/loader.gif'

const style = {
    container: {
        position: 'absolute',
        top: 0,
        bottom: styleVars.mainAppPadding,
        left: 0,
        right: 0
    },
    image: {
        transform: 'scale(0.8)'
    }
}

export default useSheet(function(props) {
    const {sheet: {classes}} = props

    const containerClasses = classNames(classes.container, 'js-loader')
    
   return (
        <Flexbox name="loader-container" grow={1} container="column" justifyContent="center" alignItems="center" className={containerClasses}>
            <Delay wait={GeneralConstants.FETCHING_DELAY_MILLIS}>
                <div className={classes.image}>
                    <img src={LoaderImage} />
                </div>
            </Delay>
        </Flexbox>
    )
}, style)

