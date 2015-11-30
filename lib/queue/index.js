'use strict';
var QueueElement = require('./queue_element');

function TaskQueue(capacity){
  this.head = null;
  this.tail = null;
  this.length = 0;
  this.capacity = capacity || 1000;
  return this;
}

TaskQueue.prototype.add = function(task){
  var elem = QueueElement.getInstance(task);
  if (this.head === null){
    this.head = elem;
    this.tail = elem;
  }
  else {
    this.tail = this.tail.setGetNext(elem);
  }
  this.length += 1;

 // if (this.length > this.capacity){
 //   this.clear();
 // }
  return this;
};

TaskQueue.prototype.get = function(){
  return this.head.getValue();
};

TaskQueue.prototype.done = function(){
  this.length -= 1;
  if (this.head.isLast()){
    this.head = null;
    this.tail = null;
  }
  else {
    this.head = this.head.getNext();
  }
  return this;
};

TaskQueue.prototype.clear = function(){
  this.length = 0;
  this.head = null;
  this.tail = null;
  return this;
};

TaskQueue.prototype.isEmpty = function(){
  return this.length === 0;
};


TaskQueue.getInstance = function(capacity){
  return new TaskQueue(capacity);
};

module.exports = TaskQueue;