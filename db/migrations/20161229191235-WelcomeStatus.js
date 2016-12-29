exports.up = function (r, connection) {
    r.table('User').update({
        payload: {
            welcomeStatus: 'DONE'
        }
    }).run(connection)
};

exports.down = function (r, connection) {
  
};