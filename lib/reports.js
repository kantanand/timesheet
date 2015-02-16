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
//  Private methods

function _current(fn) {
  fn = fn || shared.handler;
  const user  = shared.user();

  assert(user);

  co(function *() {
    const current = yield ds.current(user);
    const msg =
      fmt(USER_FORMAT, user) +
      fmt('current task\n > '.black) +
      fmt('%s\n'.cyan, current || 'None');
    fn(null, msg);
  }).catch(fn);
}


// -----------------------------------------------------------------
//  Exports

exports = module.exports = {
  current: _current
};