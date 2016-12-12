import React, {Component, PropTypes} from 'react'
import classAutobind from 'class-autobind'
import classNames from 'classnames'
import useSheet from 'react-jss'
import Icon from 'react-fontawesome'

import FollowUpPreviewItem from './FollowUpPreviewItem'
import PreviewGroupPlaceholder from '../Preview/PreviewGroupPlaceholder'
import styleVars from '../style-vars'

class FollowUpGroup extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, FollowUpGroup.prototype)

        this.state = {
            isCollapsed: false
        }
    }

    buildComponents() {
        const {followUps} = this.props

        if (!followUps || !followUps.length)
            return this.getEmptyCategoryPlaceholder()

        return followUps.map(({thing, commands}, index) => {
            return <FollowUpPreviewItem thing={thing} commands={commands} key={thing.id} index={index} />
        })
    }

    getEmptyCategoryPlaceholder() {
        const {category} = this.props

        return (
            <PreviewGroupPlaceholder text="Nothing to follow up here." icon="check-circle" category={category} />
        )
    }

    getCollapsedCategoryPlaceholder() {
        const {followUps, sheet: {classes}} = this.props

        const text = followUps.length === 1 ?
            `Click here to see the the task you have to follow up` :
            `Click here to see the the ${followUps.length} tasks you have to follow up`

        return (
            <PreviewGroupPlaceholder text={text}
                                     onClick={this.toggleCategoryCollapseMode}
                                     className={classes.collapsedPlaceholder}/>
        )
    }

    toggleCategoryCollapseMode() {
        if (this.hasFollowUps()) {
            this.setState({
                isCollapsed: !this.state.isCollapsed
            })
        }
    }

    hasFollowUps() {
        return this.props.followUps && this.props.followUps.length
    }

    render() {
        const {category, className, sheet: {classes}} = this.props

        const followUpsSection = this.state.isCollapsed ? this.getCollapsedCategoryPlaceholder() : this.buildComponents()
        const titleIcon = this.hasFollowUps() ?
            <Icon name={this.state.isCollapsed ? 'angle-up' : 'angle-down'} className={classes.collapseIcon} /> :
            null


        const containerClass = classNames(classes.container, 'clearfix')
        const titleClass = classNames(classes.header, className)

        return (
            <div name={`container-${category.key}`} className={containerClass}>
                <div name="group-title" className={titleClass}>
                    <span className={this.hasFollowUps() ? classes.headerWhenCollapsible : ''} onClick={this.toggleCategoryCollapseMode}>
                        {category.label}
                        {titleIcon}
                    </span>
                </div>
                {followUpsSection}
            </div>
        )
    }
}

FollowUpGroup.propTypes = {
    category: PropTypes.object.isRequired,
    followUps: PropTypes.array,
    className: PropTypes.string
}

const style = {
    container: {
        maxWidth: styleVars.maxContentWidth
    },
    header: {
        color: '#515151',
        textTransform: 'uppercase',
        marginTop: 26,
        marginBottom: 13,
        marginLeft: 1
    },
    headerWhenCollapsible: {
        cursor: 'pointer'
    },
    collapsedPlaceholder: {
        cursor: 'pointer'
    },
    collapseIcon: {
        marginLeft: 10
    }
}

export default useSheet(FollowUpGroup, style)