var Server = require('./server');
var Client = require('./client');

function Scheduler(conf){
  conf = conf || {};
  this.keys = conf.keys || [];
  this.reinitId = 0;
  this.interval = conf.interval || 100;
  this.waitTimeout = conf.waitTimeout || this.interval*3;

  this.uid = conf.uid = conf.uid || String(Math.random());

  this.serversConf = {};
  this.self = new Server(conf);
  this.client = {};

  this.isConnected = false;
  this._isMaster = true;

  this._isMasterByKey = {};

  this.reinitializeKey = {};

  this.intObj = null;
  this.self.addObserver(this);

  this.onErrorCallback = console.error;
  return this;
}

Scheduler.prototype.onError = function(cb){
  this.self.onError(cb);
  Object.keys(this.client).forEach(function(k){
    this.client[k].onError(cb);
  }.bind(this));
};


Scheduler.prototype.update = function(key){
  if (key === undefined){
    this._rebalanceAll();
  }
  else {
    this._rebalanceKey(key);
  }
};

Scheduler.prototype._rebalanceAll = function(){
  var reinitId = ++this.reinitId;
  this._isMaster = true;
  this._isMasterByKey = {};
  this.keys.map(function(key){
    this._isMasterByKey[key] = true;
    return key;
  }.bind(this)).forEach(function(key){
    this._rebalanceKey(key);
  }.bind(this));

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
    if (reinitId === self.reinitId) {
      if (slave > 0) {
        self._isMaster = false;
      }
    }
  }
};

Scheduler.prototype._rebalanceKey = function(key){
  this.reinitializeKey[key] = true;
  delete this._isMasterByKey[key];
  if (this.keys.indexOf(key) === -1){
    delete this.reinitializeKey[key];
    return this;
  }
  this._isMasterByKey[key] = true;
  var self = this;
  if (!this.self.isAnyConnect()){
    this.reinitializeKey[key] = false;
    return;
  }

  var results = {
    err: 0,
    masterResponse: 0,
    slaveResponse: 0
  };

  Object.keys(this.client).forEach(function(id, ind, arr){
    this.client[id].canMasterByKey(key, function(err, canBe){
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
    self.reinitializeKey[key] = false;
    if (slave > 0){
      self._isMasterByKey[key] = false;
    }
  }

};

Scheduler.prototype.isMaster = function(){
  return this._isMaster;
};

Scheduler.prototype.isMasterByKey = function(key){
  if (this.keys.indexOf(key) === -1){
    return false;
  }
  return this._isMasterByKey[key];
};

Scheduler.prototype.addServer = function(id, serverConf){
  if (this.serversConf[id]){
    return false;
  }
  serverConf.uid = this.uid;
  serverConf.waitTimeout = this.interval * 3;
  serverConf.startTime = this.startTime;
  this.serversConf[id] = serverConf;
  this.client[id] = new Client(serverConf);
  this.client[id].addObserver(this);
  this.client[id].onError(this.onErrorCallback);

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
    this.client[id].removeObserver(this);
  }.bind(this));
};

Scheduler.prototype.start = function(){
  this.close();
};

Scheduler.prototype.start = function(){
  this.self.start();
  this._connect();
};

Scheduler.prototype.addKey = function(key){
  if (this.keys.indexOf(key) === -1){
    this.keys.push(key);
    this.self.addKey(key);
    this._isMasterByKey[key] = true;
    this._rebalanceKey(key);
  }
};

Scheduler.prototype.removeKey = function(key){
  if (this.keys.indexOf(key) !== -1){
    this.keys.splice(this.keys.indexOf(key), 1);
    this.self.removeKey(key);
    Object.keys(this.client).forEach(function(id, ind, arr){
      this.client[id].reinitMasterByKey(key);
    }.bind(this));
  }
};

module.exports = Scheduler;