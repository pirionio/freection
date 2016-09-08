import React from 'react'
import find from 'lodash/find'
import omit from 'lodash/omit'

export function getChildOfType(children, type) {
    return find(children, child => child.type.name === type.name)
}

export function createSlots(...names) {
    const slots = {}

    names.forEach(name => {
        const tempFunc = new Function('action',
            `return function ${name} (props) {` +
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