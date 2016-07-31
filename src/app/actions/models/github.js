module.exports = {
    name: 'github',
    actions: [
        {
            name: 'fetchGithub',
            type: 'get',
            path: '/api/github',
            completeParams: {
                github: 'result'
            }
        },
        {
            name: 'enableRepository',
            params: ['fullName'],
            type: 'post',
            path: '/api/github/enablerepository/${fullName}'
        },
        {
            name: 'disableRepository',
            params: ['fullName'],
            type: 'post',
            path: '/api/github/disablerepository/${fullName}'
        },
    ]
}
