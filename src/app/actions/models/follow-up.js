module.exports = {
    name: 'follow up',
    actions: [
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