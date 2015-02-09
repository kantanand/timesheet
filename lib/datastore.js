// -----------------------------------------------------------------
//  datastore.js
//
//  timesheet
//  Copyright 2015. Paul Jackson. All rights reserved.
//
//  Paul Jackson <pjackson@gmail.com>
//


// -----------------------------------------------------------------
//  Dependencies

const
    redis = require('redis').createClient();


// -----------------------------------------------------------------
//  Private methods

function _current(username) {
  return function (done) {
    process.nextTick(function () {
      done(null, 'userds:1423493400205');
    });
  };
}

function _set_current() {
  return function (done) {
    process.nextTick(function () {
      done();
    });
  };
}

function _push(key, value) {
  return function (done) {
    process.nextTick(function () {
      done();
    });
  };
}


// -----------------------------------------------------------------
//  Exports

exports = module.exports = {
  current: _current,
  set_current: _set_current,
  push_task: _push
};