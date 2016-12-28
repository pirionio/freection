import React, {Component} from 'react'
import useSheet from 'react-jss'

import WelcomeStep from '../WelcomeStep'
import IntegrationsBox from '../../Integrations/IntegrationsBox'

class WelcomeIntegrations extends Component {
    render() {
        const {location, sheet: {classes}} = this.props

        return (
            <WelcomeStep title="Integrations">
                <IntegrationsBox expand={location.query.expand} className={classes.integrationsBox} />
            </WelcomeStep>
        )
    }
}

const style = {
    integrationsBox: {
        marginTop: 55
    }
}

export default useSheet(WelcomeIntegrations, style)