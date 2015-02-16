// -----------------------------------------------------------------
//  reports.js
//
//  timesheet
//  Copyright 2015. Paul Jackson. All rights reserved.
//
//  Paul Jackson <pjackson@gmail.com>


// -----------------------------------------------------------------
//  Dependencies

const
    assert = require('assert')
  , util   = require('util')
  , co     = require('co')
  , ds     = require('./datastore')
  , shared = require('./shared');

require('colors');


// -----------------------------------------------------------------
//  Constants

const USER_FORMAT = shared.consts.USER_FORMAT;
const fmt         = util.format;


// -----------------------------------------------------------------
//  Format methods

function _format_completed_task(task) {
  assert(task);

  task = task.split(':');
  const
      name  = task[0]
    , start = new Date(parseInt(task[1])).toTimeString().substring(0, 8)
    , end   = new Date(parseInt(task[2])).toTimeString().substring(0, 8)
    , hours = parseFloat(task[3]);

    return fmt('%s '.cyan, name) + fmt('<%s—%s :: %s hours>\n'.grey, start, end, hours);
}

// -----------------------------------------------------------------
//  Private methods

function _current(fn) {
  fn = fn || shared.handler;
  const user  = shared.user();

  assert(user);

  co(function *() {
    const current = yield ds.current(user);
    var task = 'None', start = null;
    if (current) {
      task  = current.split(':')[0];
      start = new Date(parseInt(current.split(':')[1])).toTimeString().substring(0, 8);
    }

    var msg =
      fmt(USER_FORMAT, user) +
      fmt('current task\n > '.black) +
      fmt('%s '.cyan, task);
    msg += (current)
      ? fmt('<%s :: %s mins>\n'.grey, start, 60 * shared.calculate_hours(current))
      : '\n';
    fn(null, msg);
  }).catch(fn);
}

function _last(fn) {
  fn = fn || shared.handler;
  const user = shared.user();
  const day  = shared.day_key();

  assert(user);
  assert(day);

  co(function *() {
    const task = yield ds.last(fmt('%s:%s', user, day));
    var msg =
      fmt(USER_FORMAT, user) +
      fmt('last task\n > '.black);
    msg += (task.length > 0)
      ? _format_completed_task(task.pop())
      : 'None\n'.cyan;
    fn(null, msg);
  }).catch(fn);
}


// -----------------------------------------------------------------
//  Exports

exports = module.exports = {
  current: _current,
  last: _last
};