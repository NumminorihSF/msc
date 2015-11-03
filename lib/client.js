'use strict';

function Client (conf){
  conf = conf || {};

  this.port = conf.port || 8778;
  this.host = conf.host || '127.0.0.1';
  this.interval = conf.interval || 100;
  this.waitTimeout = conf.waitTimeout || this.interval*3;
  this.observers = [];
  this.startTime = conf.startTime || Date.now();
  this.lastSuccess = true;

  this.idKey = conf.uid;

  this.hc = new (require('herald-client'))({
    logger: conf.logger || {
      trace: function(){},
      debug: function(){},
      info: function(){},
      warn: function(){},
      error: function(){},
      fatal: function(){}
    },
    name: 'msc',
    uid: conf.uid
  }, conf.algorithm || conf.needCrypt, conf.key);
  this.hc.on('error', function(err){
    console.error(err);
  });
  this.hc.addRpcWorker('__heartbeat__', function(args, callback){
    callback(null, args);
  });
  this.hc.on('connect', function(){
    this.notify();
  }.bind(this));
}

Client.prototype.canMaster = function(callback){
  var selfTime = Date.now() - this.startTime;
  this.hc.rpc('herald-server', {name: 'canMaster', args:{time: selfTime, key: this.idKey}}, function(err, res){
    if (err) {
      return callback(null, true);
    }
    else {
      return callback(null, res && res.canBeMaster);
    }
  }.bind(this));
};

Client.prototype.isConnected = function(callback){
  if (!this.hc.connected){
    return callback(null, false);
  }
  this.hc.rpcUid(this.hc.uid, {name:'__heartbeat__', args:{alive: 1}}, {timeout: this.waitTimeout}, function(err){
    if (err){
      callback(null, false);
      if (this.lastSuccess) {
        this.lastSuccess = false;
        this.notify();
      }
    }
    else {
      if (!this.lastSuccess){
        this.notify();
      }
      callback(null, true);
    }
  }.bind(this));
};

Client.prototype.addObserver = function(callback){
  this.observers.push(callback);
  return this;
};

Client.prototype.removeObserver = function(callback){
  if (this.observers.indexOf(callback) === -1) {
    return this;
  }
  this.observers.splice(this.observers.indexOf(callback), 1);
  return this;
};

Client.prototype.notify = function(){
  this.observers.forEach(function(o){
    o.update();
  });
};

Client.prototype.connect = function() {
  this.hc.connect({port: this.port, host: this.host});
};

Client.prototype.close = function(cb){
  this.hc.close(cb);
};

module.exports = Client;

