import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'

import * as TrelloActions from '../../actions/trello-actions'
import {InvalidationStatus} from '../../constants'
import Board from '../Trello/TrelloBoard'
import Loader from '../UI/Loader'
import Flexbox from '../UI/Flexbox'
import Scrollable from '../Scrollable/Scrollable'
import styleVars from '../style-vars'

class TrelloIntegration extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, TrelloIntegration.prototype)
    }

    componentDidMount() {
        this.props.dispatch(TrelloActions.fetchUserInfo())
    }

    getFetching() {
        const {sheet: {classes}} = this.props

        return (
            <div className={classes.fetching}>
                <Loader />
            </div>
        )
    }

    getNotActive() {
        return (
            <Flexbox container="column">
                <div>Every Trello card you're a member of will appear in your Inbox.</div>
                <div>You can then decide what to add to your To Do and Follow Up boards.</div>
            </Flexbox>
        )
    }

    getActive() {
        const {boards, sheet: {classes}} = this.props
        const rows = boards.map(board => <Board key={board.id} board={board} />)

        return (
            <Flexbox name="trello-content" grow={1} container="column">
                <Flexbox name="trello-title" className={classes.title}>
                    Boards
                </Flexbox>
                <Flexbox name="trello-explanation" className={classes.explanation}>
                    Select the boards you want to get notifications for:
                </Flexbox>
                <Flexbox name="trello-board-list" grow={1} container="column">
                    {rows}
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
                {content}
            </Flexbox>
        )
    }
}

const style = {
    container: {
        color: 'black',
        fontSize: '0.857em',
        lineHeight: 2
    },
    title: {
        marginBottom: 20,
        fontWeight: 'bold'
    },
    explanation: {
        marginBottom: 20,
        color: styleVars.watermarkColor
    },
    fetching: {
        position: 'relative',
        height: 180
    }
}

TrelloIntegration.propTypes = {
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

export default useSheet(connect(mapStateToProps)(TrelloIntegration), style)