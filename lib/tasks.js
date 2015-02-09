// -----------------------------------------------------------------
//  tasks.js
//  
//  timesheet
//  Copyright 2015. Paul Jackson. All rights reserved.
//  
//  Paul Jackson <pjackson@gmail.com> 


// -----------------------------------------------------------------
//  Dependencies

const
    assert = require('assert')
  , fs     = require('fs')
  , util   = require('util');

require('colors');


// -----------------------------------------------------------------
//  Constants

const DOT_FILE = process.env.HOME + '/.timesheet';
const fmt = util.format;


// -----------------------------------------------------------------
//  Helpers

function _handler(err, data) {
  if (err) {
    console.error('ERR: %s'.red, err);
    process.exit(1);
  } else {
    console.log(data);
  }
}

function _validateTime(time) {
  var timeExpr = /^\d{2}:\d{2}$/;
  if (!timeExpr.test(time)) {
    _handler(fmt('invalid time format (expected hh:mm)', time));
  }
}

function _getTime() {
  var date = new Date();
  return date.getHours() + ':' + date.getMinutes();
}

// function _getUsername(fn) {
//   fs.exists(DOT_FILE, function (exists) {
//     fn = fn || _handler;
//     if (!exists) {
//       return fn('Not logged in. Log in to continue.');
//     }
//
//     const userInfo = require(DOT_FILE);
//     fn(null, userInfo.name);
//   });
// }


// -----------------------------------------------------------------
//  Commands

function _start(task, time) {
  if (!time) {
    time = _getTime();
  }
  if (time) {
    _validateTime(time);
  }
  console.log('> starting %s [%s]'.cyan, task, time);
}

function _login(username, fn) {
  assert(username);

  fs.writeFile(DOT_FILE, JSON.stringify({name: username}, null, ' '), function (err) {
    fn = fn || _handler;
    if (err) return fn(err);
    fn(null, fmt('> ok [%s]'.cyan, username));
  });
}


// -----------------------------------------------------------------
//  Exports

exports = module.exports = {
  login: _login,
  start: _start
};