let mysql = require('mysql');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'eee',
    password: 'Qzxc1234',
    database: 'db'
});

connection.connect(function() {

    console.log("Connected to MySql");

    connection.query("SELECT * FROM tbl", function(error, results, fields) {

        console.log(results[0].Field);

        setTimeout(function() {

            connection.end(function() {
    
                console.log("Connection closed");
    
            });
    
        }, 2000);

    });

});