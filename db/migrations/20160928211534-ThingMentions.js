// We add the 'mentioned' and 'subscribers' lists to a Thing here.
// Make sure these fields appear as empty lists for existing Things.
exports.up = function (r, connection) {
    r.table('Thing')
        .filter(function(thing) {
            return thing.hasFields('mentioned').not()
        })
        .update(function() {
            return {
                mentioned: []
            }
        }).run(connection);

    r.table('Thing')
        .filter(function(thing) {
            return thing.hasFields('subscribers').not()
        })
        .update(function() {
            return {
                subscribers: []
            }
        }).run(connection);
};

exports.down = function (r, connection) {
    // No way to go back.
};