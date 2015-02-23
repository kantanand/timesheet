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
  , columns = require('columnify')
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

function _format_completed_tasklist(tasks) {
  const TASK_NAME = 0, TASK_HOURS = 3;

  var task, results = {};
  while(tasks.length > 0) {
    task = tasks.pop().split(':');
    assert(task.length === 4);
    if (results[task[TASK_NAME]]) {
      results[task[TASK_NAME]] += parseFloat(task[TASK_HOURS]);
    } else {
      results[task[TASK_NAME]] = parseFloat(task[TASK_HOURS]);
    }
  }

  var dataset = [];
  Object.keys(results).forEach(function (key) {
    dataset.push({ task: key, hours: results[key].toFixed(2) });
  });
  dataset.sort(function (a, b) {
    return b.hours - a.hours;
  });

  return columns(dataset, {
    minWidth: 15,
    dataTransform: function (data) {
      return (!isNaN(parseFloat(data)) && isFinite(data))
        ? fmt('%s', data.grey)
        : fmt('%s', data.cyan);
    }
  });
}

function _format_day_key(key) {
  assert(key);
  
  var info = /.*:(\d{4})(\d{2})(\d{2})$/.exec(key);
  var date = new Date(info[1], info[2], info[3]);
  return date.toDateString();
}

function _format_completed_tasklists(keys, tasklists) {
  assert(keys);
  assert(tasklists);
  assert(keys.length === tasklists.length);

  var task, key, results = '';
  while((task = tasklists.shift())) {
    key = keys.shift();
    if (task.length === 0) continue;
    results += fmt(' > %s'.red, _format_day_key(key));
    results += fmt('\n\n%s\n\n', _format_completed_tasklist(task));
  }
  return results;
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

    var hours = (current) ? shared.calculate_hours(current) : '';
    var msg =
      fmt(USER_FORMAT, user) +
      fmt('current task\n > '.black) +
      fmt('%s '.cyan, task);
    msg += (current)
      ? fmt('<%s :: %s hours [%s mins]>\n'.grey, start, hours, (60 * hours).toFixed(2))
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

function _today(fn) {
  fn = fn || shared.handler;
  const user = shared.user();
  const day  = shared.day_key();

  assert(user);
  assert(day);

  co(function *() {
    const tasks = yield ds.today(fmt('%s:%s', user, day));
    var msg =
      fmt(USER_FORMAT, user) +
      fmt('today'.black);
    msg += (tasks.length > 0)
      ? fmt('\n\n%s\n', _format_completed_tasklist(tasks))
      : '\n >'.black + ' None\n'.cyan;
    fn(null, msg);
  }).catch(fn);
}

function _week(fn) {
  fn = fn || shared.handler;
  const user = shared.user();
  const day  = shared.day_key();

  assert(user);
  assert(day);

  const days    = [ fmt('%s:%s', user, day) ];
  var date      = new Date();
  var remaining = date.getDay();
  while (remaining-- > 0) {
    date.setDate(date.getDate() - 1);
    days.push(fmt('%s:%s', user, shared.key_for_date(date)));
  }
  days.reverse();

  co(function *() {
    var tasks = yield ds.week(days.slice(0));
    var msg =
      fmt(USER_FORMAT, user) +
      fmt('week'.black);
    msg += (tasks.length > 0)
      ? fmt('\n\n%s\n', _format_completed_tasklists(days, tasks))
      : '\n >'.black + ' None\n'.cyan;
    fn(null, msg);
  }).catch(fn);
}

function _month(fn) {
  fn = fn || shared.handler;
  const user = shared.user();
  const day  = shared.day_key();

  assert(user);
  assert(day); 

  const days    = [ fmt('%s:%s', user, day) ];
  var date      = new Date();
  var remaining = date.getDate();
  while (--remaining > 0) {
    date.setDate(date.getDate() - 1);
    days.push(fmt('%s:%s', user, shared.key_for_date(date)));
  }
  days.reverse();

  co(function *() {
    var tasks = yield ds.week(days.slice(0));
    var msg =
      fmt(USER_FORMAT, user) +
      fmt('month'.black);
    msg += (tasks.length > 0)
      ? fmt('\n\n%s\n', _format_completed_tasklists(days, tasks))
      : '\n >'.black + ' None\n'.cyan;
    fn(null, msg);
  }).catch(fn);
}

// -----------------------------------------------------------------
//  Exports

exports = module.exports = {
  current: _current,
  last: _last,
  today: _today,
  week: _week,
  month: _month
};