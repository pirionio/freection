const union = require('lodash/union')

exports.up = function (r, connection) {
    r.table('Thing')
        .filter(function(thing) {
            return thing.hasFields('all').not()
        })
        .run(connection)
        .then(function(things) {
            things.forEach(function(thing) {
                const creatorAndTo = [thing.creator.id, thing.to.id]
                const mentioned = thing.mentioned || []
                r.table('Thing').get(thing.id).update({all: union(creatorAndTo, mentioned)}).run(connection)
            })
        }
    )
};

exports.down = function (r, connection) {
  
};