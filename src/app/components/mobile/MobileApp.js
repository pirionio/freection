import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import {initialize} from '../../util/analytics'
import MobileMessageBox from './MobileMessageBox.js'

class MobileApp extends Component {
    componentDidMount() {
        const {currentUser} = this.props

        if (currentUser.isAuthenticated) {
            initialize(currentUser)
        }
    }

    render() {
        const {currentUser} = this.props

        if (!currentUser.isAuthenticated) {
            window.location = '/login/google/mobile'
            return (<div>
                Redirecting to google login
            </div>)
        }

        return (
            <MobileMessageBox/>
        )
    }
}

MobileApp.propTypes = {
    currentUser: PropTypes.object.isRequired
}

const mapStateToProps = state => {
    return {
        currentUser: state.userProfile,
    }
}

export default connect(mapStateToProps)(MobileApp)