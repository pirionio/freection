import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'

import * as TrelloActions from '../../actions/trello-actions'
import {InvalidationStatus} from '../../constants'
import Board from './TrelloBoard'
import Loader from '../UI/Loader'
import Flexbox from '../UI/Flexbox'
import Scrollable from '../Scrollable/Scrollable'
import TrelloLogoBlack from '../../static/TrelloLogoBlack.png'

class Trello extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, Trello.prototype)
    }

    componentDidMount() {
        this.props.dispatch(TrelloActions.fetchUserInfo())
    }

    getFetching() {
        return (
            <Loader />
        )
    }

    getNotActive() {
        return (
            <Flexbox name="trello-not-active">
                <span>You are not integrated with Trello yet, </span>
                <a href="/api/trello/integrate">
                    integrate with Trello now
                </a>
                .
            </Flexbox>
        )
    }

    getActive() {
        const {boards, sheet: {classes}} = this.props
        const rows = boards.map(board => <Board key={board.id} board={board} />)

        return (
            <Flexbox name="trello-content" grow={1} container="column">
                <Flexbox name="trello-header" className={classes.contentHeader}>
                    <Flexbox>
                        Pick the boards you would like to get notifications for.
                    </Flexbox>
                </Flexbox>
                <Flexbox name="trello-board-list" grow={1} container="column">
                    <Scrollable>
                        {rows}
                    </Scrollable>
                </Flexbox>
            </Flexbox>
        )
    }

    render() {
        const {fetched, active, sheet: {classes}} = this.props

        const content =
            !fetched ? this.getFetching() :
            !active ? this.getNotActive() :
            this.getActive()

        return (
            <Flexbox name="trello-container" grow={1} container="column" className={classes.container}>
                <Flexbox className={classes.title}>
                    <img src={TrelloLogoBlack} className={classes.logo} />
                    Trello Integration
                </Flexbox>
                {content}
            </Flexbox>
        )
    }
}

const style = {
    container: {
        color: 'black',
        fontSize: '1.2em'
    },
    title: {
        fontSize: '1.3em',
        marginBottom: 20
    },
    logo: {
        marginRight: 10,
        width:19,
        height:18
    },
    contentHeader: {
        marginBottom: 20
    }
}

Trello.propTypes = {
    active: PropTypes.bool.isRequired,
    boards: PropTypes.array,
    fetched: PropTypes.bool.isRequired,
    clientId: PropTypes.string
}

function mapStateToProps(state) {
    return {
        active: state.trello.active,
        boards: state.trello.boards,
        fetched: state.trello.invalidationStatus === InvalidationStatus.FETCHED
    }
}

export default useSheet(connect(mapStateToProps)(Trello), style)