exports.up = function (r, connection) {
    r.table('Event')
        .filter({eventType: 'COMMENT'})
        .update(function() {
            return {
                payload: {
                    mentioned: []
                }
            }
        }).run(connection)

    r.table('Event')
        .filter({eventType: 'MENTIONED'})
        .delete()
        .run(connection)
};

exports.down = function (r, connection) {

};