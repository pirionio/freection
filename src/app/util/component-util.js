const React = require('react')
const find = require('lodash/find')
const omit = require('lodash/omit')

function getChildOfType(children, type) {
    return find(children, child => child.type.name === type.name)
}

function createSlots(...names) {
    var slots = {}

    names.forEach(name => {
        const tempFunc = new Function('action',
            'return function ' + name + '(props) {' +
                'return action(props);' +
            '};')

        slots[name] = tempFunc(OneChildComponent)
    })

    return slots
}

function OneChildComponent(props) {
    return React.cloneElement(
        React.Children.only(props.children),
        omit(props, 'children')
    )
}

module.exports = {getChildOfType, createSlots}