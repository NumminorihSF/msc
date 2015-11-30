'use strict';

function QueueElement (value){
  this.value = value;
  this.next = null;
}

QueueElement.prototype.getValue = function(){
  return this.value;
};

QueueElement.prototype.setNext = function(queueElement){
  this.next = queueElement;
  return this;
};

QueueElement.prototype.getNext = function(){
  return this.next;
};

QueueElement.prototype.setGetNext = function(queueElement){
  this.next = queueElement;
  return this.next;
};

QueueElement.prototype.isLast = function(){
  return this.next === null;
};

QueueElement.getInstance = function(value){
  return new QueueElement(value);
};

module.exports = QueueElement;