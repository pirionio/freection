module.exports = {
    name: 'welcome',
    actions: [
        {
            name: 'set welcome status',
            params: ['welcomeStatus'],
            type: 'post',
            path: '/api/users/welcome/status',
            body: {
                welcomeStatus: 'welcomeStatus'
            },
            completeParams: {
                user: 'result'
            }
        }
    ]
}
