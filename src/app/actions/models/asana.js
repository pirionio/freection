module.exports = {
    name: 'asana',
    actions: [
        {
            name: 'fetchAsana',
            type: 'get',
            path: '/api/asana',
            completeParams: {
                asana: 'result'
            }
        },
        {
            name: 'enableProject',
            params: ['id'],
            type: 'post',
            path: '/api/asana/enableproject/${id}'
        },
        {
            name: 'disableProject',
            params: ['id'],
            type: 'post',
            path: '/api/asana/disableproject/${id}'
        },
    ]
}
