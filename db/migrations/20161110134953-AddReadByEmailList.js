exports.up = function (r, connection) {
    r.table('Event')
        .filter(event => event('payload').hasFields('readByList') && event('payload').hasFields('readByEmailList').not())
        .update({
            payload: {
                readByEmailList: []
            }
        }).run(connection)
};

exports.down = function (r, connection) {
  
};