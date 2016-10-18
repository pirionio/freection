const union = require('lodash/union')

exports.up = function (r, connection) {
    r.table('Thing')
        .run(connection)
        .then(function(things) {
                things.forEach(function(thing) {
                    r.table('Thing').get(thing.id).update({
                        followUpers: union(thing.followUpers, thing.subscribers),
                        subscribers: []
                    }).run(connection)
                })
            }
        )
};

exports.down = function (r, connection) {

};