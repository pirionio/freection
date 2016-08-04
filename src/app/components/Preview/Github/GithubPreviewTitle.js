const React = require('react')

const GithubPreviewTitle = ({thing}) => {
    return <a href={thing.payload.url} target="blank">{thing.subject}</a>
}

module.exports = GithubPreviewTitle
