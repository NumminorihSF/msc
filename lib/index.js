var Server = require('./server');
var Client = require('./client');

function Scheduler(conf){
  conf = conf || {};

  this.interval = conf.interval || 100;
  this.waitTimeout = conf.waitTimeout || this.interval*3;

  this.uid = conf.uid = conf.uid || String(Math.random());

  this.serversConf = {};
  this.self = new Server(conf);
  this.client = {};

  this.isConnected = false;
  this._isMaster = true;

  this.intObj = null;
  this.self.addObserver(this);

  return this;
}


Scheduler.prototype.update = function(){
  this._isMaster = true;
  var self = this;
  if (!this.self.isAnyConnect()){
    return;
  }
  var results = {
    err: 0,
    masterResponse: 0,
    slaveResponse: 0
  };

  Object.keys(this.client).forEach(function(id, ind, arr){
    this.client[id].canMaster(function(err, canBe){
      if (err){
        results.err += 1;
      }
      else if (canBe){
        results.masterResponse += 1;
      }
      else {
        results.slaveResponse += 1;
      }
      if (arr.length <= results.err + results.masterResponse + results.slaveResponse){
        onEnd(results.err, results.masterResponse, results.slaveResponse);
      }
    }.bind(this));
  }.bind(this));

  function onEnd(err, master, slave){
    if (slave > 0){
      self._isMaster = false;
    }
  }
};

Scheduler.prototype.isMaster = function(){
  return this._isMaster;
};


Scheduler.prototype.addServer = function(id, serverConf){
  if (this.serversConf[id]){
    return false;
  }
  serverConf.uid = this.uid;
  serverConf.waitTimeout = this.interval * 3;
  this.serversConf[id] = serverConf;
  this.client[id] = new Client(serverConf);
  this.client[id].addObserver(this);
  if (this.isConnected) {
    this.client[id].connect();
  }
};

Scheduler.prototype.removeServer = function(id){
  if (this.serversConf[id]){
    this.client[id].close(function(){
      delete this.serversConf[id];
      delete this.client[id];
    }.bind(this));
  }
};

Scheduler.prototype.checkOther = function(){
  Object.keys(this.client).forEach(function(id, ind, arr){
    this.client[id].isConnected(function(){});
  }.bind(this));
};

Scheduler.prototype._connect = function(){
  this.isConnected = true;
  this.intObj = setInterval(function(){
    this.checkOther();
  }.bind(this), this.interval);
  Object.keys(this.client).forEach(function(id){
    this.client[id].connect();
  }.bind(this));
};

Scheduler.prototype.close = function(){
  this.self.stop();
  clearInterval(this.intObj);
  Object.keys(this.client).forEach(function(id){
    this.client[id].close();
  }.bind(this));
};

Scheduler.prototype.start = function(){
  this.self.start();
  this._connect();
};

module.exports = Scheduler;