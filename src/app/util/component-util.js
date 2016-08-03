const React = require('react')
const find = require('lodash/find')

function getChildOfType(children, type) {
    return find(children, child => child.type.name === type.name)
}

function createSlots(...names) {
    var slots = {}

    names.forEach(name => {
        const tempFunc = new Function('action',
            'return function ' + name + '({children}) {' +
                'return action({children});' +
            '};')

        slots[name] = tempFunc(OneChildComponent)
    })

    return slots
}

function OneChildComponent({children}) {
    return React.Children.only(children)
}

module.exports = {getChildOfType, createSlots}