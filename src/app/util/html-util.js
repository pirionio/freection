const sanitizeHtml = require('sanitize-html')
const cheerio = require('cheerio')
const juice = require('juice/client')

function parse(html) {
    let parsedHtml = style(html)
    parsedHtml = restructure(parsedHtml)
    parsedHtml = sanitize(parsedHtml)
    return parsedHtml
}

function style(html) {
    return juice(html)
}

function restructure(html) {
    const $ = cheerio.load(html)
    $('.gmail_quote').prev('br').remove()
    $('.gmail_quote').remove()
    return $.html()
}

function sanitize(html) {
    return sanitizeHtml(html, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img', 'span', 'center', 'colgroup', 'col' ]),
        allowedAttributes: {
            '*': ['style', 'align', 'valign', 'width', 'height', 'title', 'dir'],
            a: [ 'href', 'name', 'target' ],
            img: [ 'src', 'alt' ],
            table: ['border', 'cellpadding', 'cellspacing', 'bgcolor']
        }
    })
}

module.exports = {
    parse
}