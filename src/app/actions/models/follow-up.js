module.exports = {
    name: 'follow up',
    actions: [
        {
            name: 'set state',
            params: ['followUps']
        },
        {
            name: 'fetchFollowUps',
            type: 'get',
            path: '/api/things/followups',
            completeParams: {
                followUps: 'result'
            }
        }
    ]
}