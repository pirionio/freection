import React, {Component} from 'react'

import Flexbox from '../UI/Flexbox'
import IntegrationBox from './IntegrationsBox'

class Integrations extends Component {
    render() {
        const {location} = this.props

        return (
            <Flexbox name="integrations-container" grow={1} container="column" alignItems="center">
                <IntegrationBox expand={location.query.expand} />
            </Flexbox>
        )
    }
}

export default Integrations
