var S = require('../lib');

var s = new S({port: 8000, interval: 100, algorithm: 'aes128', key: 'adfhjewhrewkdf'});
s.addServer(1, {port: 8101, algorithm: 'aes128', key: 'adfhjewhrewkdf'});
s.addServer(2, {port: 8102, algorithm: 'aes128', key: 'adfhjewhrewkdf'});
s.addServer(3, {port: 8103, algorithm: 'aes128', key: 'adfhjewhrewkdf'});
s.addServer(4, {port: 8104, algorithm: 'aes128', key: 'adfhjewhrewkdf'});
s.addServer(5, {port: 8105, algorithm: 'aes128', key: 'adfhjewhrewkdf'});
s.addServer(1, {port: 8201, algorithm: 'aes128', key: 'adfhjewhrewkdf'});
s.addServer(2, {port: 8202, algorithm: 'aes128', key: 'adfhjewhrewkdf'});
s.addServer(3, {port: 8203, algorithm: 'aes128', key: 'adfhjewhrewkdf'});
s.addServer(4, {port: 8204, algorithm: 'aes128', key: 'adfhjewhrewkdf'});
s.addServer(5, {port: 8205, algorithm: 'aes128', key: 'adfhjewhrewkdf'});
s.start();
setInterval(function(){
  console.log(s.isMaster(), s.isMasterByKey(1), s.isMasterByKey(2), s.isMasterByKey(3));
}, 1000);


s.addKey(1);

s.addKey(2);
