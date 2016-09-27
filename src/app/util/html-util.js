import sanitizeHtml from 'sanitize-html'
import cheerio from 'cheerio'
import juice from 'juice/client'
import linkifyHtml from 'linkifyjs/html'

export function parse(html) {
    let parsedHtml = style(html)
    parsedHtml = restructure(parsedHtml)
    parsedHtml = linkifyHtml(parsedHtml)
    parsedHtml = sanitize(parsedHtml)
    parsedHtml = setLinkTarget(parsedHtml)
    return parsedHtml
}

function style(html) {
    return juice(html)
}

function setLinkTarget(html) {
    const $ = cheerio.load(html)
    $('a').attr('target', '_blank')

    return $.html()
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
            a: [ 'href', 'name' ],
            img: [ 'src', 'alt' ],
            table: ['border', 'cellpadding', 'cellspacing', 'bgcolor']
        }
    })
}