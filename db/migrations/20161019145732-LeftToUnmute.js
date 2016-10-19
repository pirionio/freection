exports.up = function (r, connection) {
    r.table('Event').filter({eventType: 'JOINED_MENTION'}).update({eventType: 'UNMUTED'})
        .run(connection)

    r.table('Event').filter({eventType: 'LEFT_MENTION'}).update({eventType: 'MUTED'})
        .run(connection)
};

exports.down = function (r, connection) {
    r.table('Event').filter({eventType: 'UNMUTED'}).update({eventType: 'JOINED_MENTION'})
        .run(connection)

    r.table('Event').filter({eventType: 'MUTED'}).update({eventType: 'LEFT_MENTION'})
        .run(connection)
};