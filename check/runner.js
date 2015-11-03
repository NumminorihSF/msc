var cp = require('child_process');
require('fs').readdirSync(__dirname).forEach(function(file){
  console.log(file);
  if (file !== 'runner.js') {
    var a = cp.spawn('node', [file]);
    a.stdout.on('data', function (data) {
      process.stdout.write(file + '  |  ' + data);
    });
  }
});