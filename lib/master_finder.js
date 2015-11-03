/**
 * Created by numminorihsf on 03.11.15.
 */
function MasterFinder(){}

MasterFinder.canMaster = function(selfArg, args, callback){
  var canBeMaster;

  if (Math.abs(selfArg.time - args.time) < 5000){
    canBeMaster = args.key < selfArg.key;
  }
  else {
    canBeMaster = selfArg.time < args.time;
  }

  return callback(null, canBeMaster);
};

module.exports = MasterFinder;