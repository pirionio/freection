exports.up = function (r, connection) {
    r.table('User').update({
        integrations: {
            gmail: {
                allowSendMail: true
            }
        }
    }).run(connection)
};

exports.down = function (r, connection) {
  
};