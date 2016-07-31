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
            params: ['repositoryId'],
            type: 'post',
            path: '/api/github/enablerepository/${repositoryId}'
        },
        {
            name: 'disableRepository',
            params: ['repositoryId'],
            type: 'post',
            path: '/api/github/disablerepository/${repositoryId}'
        },
    ]
}
