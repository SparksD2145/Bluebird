var bower = require('bower')
    .commands
    .install([], {save: true }, {interactive: true})
    .on('end', function (installed) {
        console.log(installed);
    });