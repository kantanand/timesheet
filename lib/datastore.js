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
    assert = require('assert')
  , redis  = require('redis').createClient()
  , util   = require('util');


// -----------------------------------------------------------------
//  Private methods

const fmt = util.format;

function _current(username) {
  assert(username);

  return function (done) {
    redis.get(fmt('%s:current', username), done);
  };
}

function _set_current(username, task) {
  assert(username);
  assert(task);

  return function (done) {
    redis.set(fmt('%s:current', username), task, done);
  };
}

function _push(key, value) {
  assert(key);
  assert(value);

  return function (done) {
    redis.lpush(key, value, done);
  };
}


// -----------------------------------------------------------------
//  Exports

exports = module.exports = {
  current: _current,
  set_current: _set_current,
  push_task: _push
};