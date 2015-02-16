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
  , util   = require('util')
  , co     = require('co')
  , ds     = require('./datastore')
  , shared = require('./shared');

require('colors');


// -----------------------------------------------------------------
//  Constants

const DOT_FILE    = shared.consts.DOT_FILE;
const USER_FORMAT = shared.consts.USER_FORMAT;
const fmt         = util.format;


// -----------------------------------------------------------------
//  Helpers

function _validate_time(time) {
  var timeExpr = /^\d{2}:\d{2}$/;
  if (!timeExpr.test(time)) {
    shared.handler(fmt('invalid time format (expected hh:mm)', time));
  }
}

function _day_key() {
  return new Date().toISOString().substr(0, 10).replace(/-/g,'');
}

function _generate_date(time) {
  const start = new Date();
  if (time) {
    const hm = time.split(':');
    start.setHours(hm[0]);
    start.setMinutes(hm[1]);
    start.setSeconds(0);
    start.setMilliseconds(0);
  }
  return +start;
}

function _calculate_hours(data) {
  const date  = data.split(':');
  const start = new Date(parseInt(date[1]));
  const end   = new Date(parseInt(date[2]));
  const hours = (((end.getTime() - start.getTime()) / 1000) / 60) / 60;

  return +hours.toFixed(2);
}


// -----------------------------------------------------------------
//  Commands

function _stop(time, fn) {
  assert(shared.user());

  if (typeof time === 'function') {
    fn   = time;
    time = undefined;
  }
  fn = fn || shared.handler;

  if (time) _validate_time(time);
  const end  = _generate_date(time);
  const user = shared.user();

  co(function *() {

    var current = yield ds.current(user);
    if (!current) {
      return fn('No current task to stop');
    }

    current += fmt(':%s', end);
    current += fmt(':%s', _calculate_hours(current));
    yield ds.push_task(fmt('%s:%s', user, _day_key()), current);
    yield ds.clear_current(user);

    fn(null, fmt(USER_FORMAT, user) + 'ok\n'.cyan);

  }).catch(fn);
}

function _start(task, time, fn) {
  assert(task);
  assert(shared.user(), 'Please log in');

  if (typeof time === 'function') {
    fn   = time;
    time = undefined;
  }
  fn = fn || shared.handler;

  if (time) _validate_time(time);
  const start = _generate_date(time);
  const user  = shared.user();

  co(function *() {

    var current = yield ds.current(user);
    if (current) {
      current += fmt(':%s', start);
      current += fmt(':%s', _calculate_hours(current));
      yield ds.push_task(fmt('%s:%s', user, _day_key()), current);
    }

    current = fmt('%s:%s', task, start);
    yield ds.set_current(user, current);

    const msg =
      fmt(USER_FORMAT, user) +
      fmt('start task\n > '.black) +
      fmt('%s '.cyan, task) +
      fmt('<%s>\n'.grey, new Date(start).toTimeString().substring(0, 8));
    fn(null, msg);

  }).catch(fn);
}

function _login(username, fn) {
  assert(username);

  fs.writeFile(DOT_FILE, JSON.stringify({name: username}, null, ' '), function (err) {
    fn = fn || shared.handler;
    if (err) return fn(err);
    fn(null, fmt(USER_FORMAT, username) + 'ok\n'.cyan);
  });
}


// -----------------------------------------------------------------
//  Exports

exports = module.exports = {
  login: _login,
  start: _start,
  stop:  _stop
};