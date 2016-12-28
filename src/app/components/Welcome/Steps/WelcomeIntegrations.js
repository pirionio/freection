import React, {Component} from 'react'

import WelcomeStep from '../WelcomeStep'
import IntegrationsBox from '../../Integrations/IntegrationsBox'

class WelcomeIntegrations extends Component {
    render() {
        const {location} = this.props

        return (
            <WelcomeStep title="Integrations">
                <IntegrationsBox expand={location.query.expand} />
            </WelcomeStep>
        )
    }
}

export default WelcomeIntegrations