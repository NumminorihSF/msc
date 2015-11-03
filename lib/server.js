var HeraldServer = require('herald-server');
var MasterFinder = require('./master_finder');

function Server(conf){
  conf = conf || {};
  conf.logger = conf.logger || {
      trace: function(){},
      debug: function(){},
      info: function(){},
      warn: function(){},
      error: function(){},
      fatal: function(){}
    };

  this.startTime = conf.startTime || Date.now();

  this.server = new HeraldServer(conf, conf.algorithm || conf.needCrypt || 'no', conf.key || '');
  this.size = 0;

  this.idKey = conf.uid;

  this.port = conf.port || 8778;

  this.observers = [];

  this.onErrorCallback = function(err){
    process.emit('error', err);
  };

  this.server.on('error', function(error){
    this.onErrorCallback(error);
  }.bind(this));
  //this.server.on('listening', function(){}.bind(this));

  this.server.on('connection', function(c){
    this.size++;
    this.notify();
    c.once('close', function(){
      this.size--;
      this.notify();
    }.bind(this));
  }.bind(this));

  this.server.addRpcWorker('canMaster', function(header, args, callback){
    var selfArg = {
      time: Date.now() - this.startTime,
      key: this.idKey
    };

    var clientArg = {
      time: args.time || 0,
      key: header || null
    };

    MasterFinder.canMaster(selfArg, clientArg, function(err, canBe){
      callback(err, {canBeMaster: canBe});
    });
  }.bind(this));
  return this;
}

Server.prototype.start = function(){
  this.server.listen(this.port);
};

Server.prototype.stop = function(){
  this.server.close();
};

Server.prototype.isAnyConnect = function(){
  return this.size > 0;
};

Server.prototype.onError = function(cb){
  this.onErrorCallback = cb;
};

Server.prototype.addObserver = function(callback){
  this.observers.push(callback);
  return this;
};

Server.prototype.removeObserver = function(callback){
  if (this.observers.indexOf(callback) === -1) {
    return this;
  }
  this.observers.splice(this.observers.indexOf(callback), 1);
  return this;
};

Server.prototype.notify = function(){
  this.observers.forEach(function(o){
    o.update();
  });
};

module.exports = Server;