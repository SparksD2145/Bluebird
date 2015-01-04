var bower = require('bower'),
    path = require('path');

bower.commands
    .install()
    .on('prompt', function (prompt) {
        console.log(prompt);
    })
    .on('end', function (installed) {
        console.log(installed);
    });
