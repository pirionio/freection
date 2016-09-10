import sanitizeHtml from 'sanitize-html'
import cheerio from 'cheerio'
import juice from 'juice/client'

export function parse(html) {
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