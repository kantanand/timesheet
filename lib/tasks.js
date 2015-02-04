var assert = require('assert');

require('colors');

function _validateTime(time) {
  var timeExpr = /^\d{2}:\d{2}$/;
  if (!timeExpr.test(time)) {
    console.error('ERR: invalid time format (expected hh:mm)'.red, time);
    process.exit(1);
  }
}

function _getTime() {
  var date = new Date();
  return date.getHours() + ':' + date.getMinutes();
}

function _start(task, time) {
  if (!time) {
    time = _getTime();
  }
  if (time) {
    _validateTime(time);
  }
  console.log('> starting %s [%s]'.cyan, task, time);
}

exports = module.exports = {
  start: _start
}