import linkifyStr from 'linkifyjs/string'

export default function textToHtml(text) {
    return linkifyStr(text).replace(/\r?\n/g, '<br />')
}

