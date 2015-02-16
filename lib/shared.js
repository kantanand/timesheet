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


// -----------------------------------------------------------------
//  Exports

exports = module.exports = {
  consts: {
    DOT_FILE: DOT_FILE,
    USER_FORMAT: USER_FORMAT
  },
  handler: _handler,
  user: _user
};