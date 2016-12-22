import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'
import Icon from 'react-fontawesome'
import Delay from 'react-delay'

import * as TrelloActions from '../../actions/trello-actions'
import Flexbox from '../UI/Flexbox'

class TrelloBoard extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, TrelloBoard.prototype)
    }

    toggleBoard(id, checked) {
        if (checked !== this.props.board.enabled) {
            if (checked)
                this.props.dispatch(TrelloActions.enableBoard(id))
            else
                this.props.dispatch(TrelloActions.disableBoard(id))
        }
    }

    render() {
        const {board, sheet: {classes}} = this.props

        return (
            <Flexbox name="trello-board" container="row" alignItems="center" className={classes.board}>
                <label>
                    <input type="checkbox"
                           disabled={board.posting}
                           onChange={event => this.toggleBoard(board.id, event.target.checked)}
                           checked={board.enabled}
                           className={classes.checkbox} />
                    {board.name}
                </label>
                {
                    board.posting ?
                        <Delay wait={150}>
                            <Icon name="spinner" pulse className={classes.icon} />
                        </Delay>
                        : null
                }
            </Flexbox>
        )
    }
}

const style = {
    board: {
        marginBottom: 10
    },
    checkbox: {
        marginRight: 5
    },
    icon: {
        marginLeft: 10
    }
}

TrelloBoard.propTypes = {
    board: PropTypes.object
}

export default useSheet(connect()(TrelloBoard), style)