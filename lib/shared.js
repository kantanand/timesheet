// -----------------------------------------------------------------
//  shared.js
//
//  timesheet
//  Copyright 2015. Paul Jackson. All rights reserved.
//
//  Paul Jackson <pjackson@gmail.com>

// -----------------------------------------------------------------
//  Dependencies

const
  fs = require('fs');

require('colors');

// -----------------------------------------------------------------
//  Constants

const DOT_FILE = process.env.HOME + '/.timesheet';
const USER_FORMAT = '\n%s$ '.yellow;


// -----------------------------------------------------------------
//  Private methods

function _handler(err, data) {
  if (err) {
    console.error('ERR: %s'.red, err);
    process.exit(1);
  } else {
    console.log(data || '');
    process.exit(0);
  }
}

function _user() {
  if (fs.existsSync(DOT_FILE)) {
    return JSON.parse(fs.readFileSync(DOT_FILE)).name;
  }
  return null;
}

function _calculate_hours(data) {
  const date  = data.split(':');
  const start = new Date(parseInt(date[1]));
  const end   = (date.length === 3)
    ? new Date(parseInt(date[2]))
    : new Date();
  const hours = (((end.getTime() - start.getTime()) / 1000) / 60) / 60;

  return +hours.toFixed(2);
}

function _key_for_date(date) {
  return date.toISOString().substr(0, 10).replace(/-/g,'');
}

function _day_key() {
  return _key_for_date(new Date());
}


// -----------------------------------------------------------------
//  Exports

exports = module.exports = {
  consts: {
    DOT_FILE: DOT_FILE,
    USER_FORMAT: USER_FORMAT
  },
  handler: _handler,
  user: _user,
  calculate_hours: _calculate_hours,
  key_for_date: _key_for_date,
  day_key: _day_key
};