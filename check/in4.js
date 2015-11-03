var S = require('../lib');

var s = new S({port: 8004, algorithm: 'aes128', key: 'adfhjewhrewkdf'});
s.addServer(1, {port: 8001, algorithm: 'aes128', key: 'adfhjewhrewkdf'});
s.addServer(2, {port: 8002, algorithm: 'aes128', key: 'adfhjewhrewkdf'});
s.addServer(3, {port: 8003, algorithm: 'aes128', key: 'adfhjewhrewkdf'});
s.addServer(0, {port: 8000, algorithm: 'aes128', key: 'adfhjewhrewkdf'});
s.addServer(5, {port: 8005, algorithm: 'aes128', key: 'adfhjewhrewkdf'});
s.start();
setInterval(function(){
  console.log(s.isMaster());
}, 1000);