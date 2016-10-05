exports.up = function (r, connection) {
    r.table('User')
        .update({refreshToken: null})
        .run(connection);
};

exports.down = function (r, connection) {
  
};