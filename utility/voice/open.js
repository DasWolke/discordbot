/**
 * Created by julia on 31.10.2016.
 */
var fs = require('fs');
var path = require('path');
process.on('message', (m) => {
    let stream = fs.createReadStream(path.resolve(m.path));
    stream.pipe(fs.createWriteStream(null, {fd: 3}))
});
