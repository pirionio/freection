import React, {Component} from 'react'
import useSheet from 'react-jss'

import Flexbox from '../UI/Flexbox'
import IntegrationBox from './IntegrationsBox'

class Integrations extends Component {
    render() {
        const {location, sheet: {classes}} = this.props

        return (
            <Flexbox name="integrations-container" grow={1} container="column" alignItems="center" className={classes.container}>
                <IntegrationBox expand={location.query.expand} />
            </Flexbox>
        )
    }
}

const style = {
    container: {
        marginLeft: -170
    }
}

export default useSheet(Integrations, style)
