exports.up = function (r, connection) {
    r.table('Thing').filter({payload: {fromSlack: true}})
        .update({
            payload: {
                source: 'SLACK',
                fromSlack: undefined
            }
        })
        .run(connection)
};

exports.down = function (r, connection) {
    r.table('Thing').filter({payload: {source: 'SLACK'}})
        .update({
            payload: {
                fromSlack: true,
                source: undefined
            }
        })
        .run(connection)

};