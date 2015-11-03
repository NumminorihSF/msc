var S = require('../lib');

var s = new S({port: 8002, interval: 1000, algorithm: 'aes128', key: 'adfhjewhrewkdf'});
s.addServer(1, {port: 8001, algorithm: 'aes128', key: 'adfhjewhrewkdf'});
s.addServer(0, {port: 8000, algorithm: 'aes128', key: 'adfhjewhrewkdf'});
s.addServer(3, {port: 8003, algorithm: 'aes128', key: 'adfhjewhrewkdf'});
s.addServer(4, {port: 8004, algorithm: 'aes128', key: 'adfhjewhrewkdf'});
s.addServer(5, {port: 8005, algorithm: 'aes128', key: 'adfhjewhrewkdf'});
s.start();
setInterval(function(){
  console.log(s.isMaster(), s.isMasterByKey(1), s.isMasterByKey(2), s.isMasterByKey(3));
}, 1000);


s.addKey(2);

s.addKey(3);
