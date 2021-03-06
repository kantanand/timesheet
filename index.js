#!/usr/bin/env node --harmony
// -----------------------------------------------------------------
//  index.js
//
//  timesheet
//  Copyright 2015. Paul Jackson. All rights reserved.
//
//  Paul Jackson <pjackson@gmail.com>
//


// -----------------------------------------------------------------
//  Dependencies

const
    assert  = require('assert')
  , program = require('commander')
  , pkg     = require('./package')
  , tasks   = require('./lib/tasks')
  , reports = require('./lib/reports');


// -----------------------------------------------------------------
//  Command flag
// -----------------------------------------------------------------
//  There does not appear to be a nice way in commander to work out
//  whether a command is valid—there's a catch-all '*' command but
//  that also outputs in the help; which is not what you would want!
//  Therefore, this flag simply states whether a command has been
//  executed; the flag is checked on the 'nextTick'.

var _handled = false;


// -----------------------------------------------------------------
//  Program

program.version(pkg.version);
program
  .command('login <username>')
  .description('Login to the timesheet system')
  .action(function (username) {
    _handled = true;
    assert(username);
    tasks.login(username);
  });

program
  .command('start <taskname> [time]')
  .description('Starts a new task with the name')
  .action(function (taskname, time) {
    _handled = true;
    assert(taskname);
    tasks.start(taskname, time);
  });

program
  .command('stop [time]')
  .description('Stops the current task')
  .action(function (time) {
    _handled = true;
    tasks.stop(time);
  });

program
  .command('cancel')
  .description('Cancels the current task')
  .action(function () {
    _handled = true;
    tasks.cancel();
  });

program
  .command('current')
  .description('Display\'s the current task information')
  .action(function () {
    _handled = true;
    reports.current();
  });

program
  .command('last')
  .description('Display\'s the last completed task')
  .action(function () {
    _handled = true;
    reports.last();
  });

program
  .command('today')
  .description('Display\'s all the tasks for today')
  .action(function () {
    _handled = true;
    reports.today();
  });

program
  .command('week')
  .description('Display\'s all the tasks for current week')
  .action(function () {
    _handled = true;
    reports.week();
  });

program
  .command('month')
  .option('-p, --previous', 'Displays the previous months report')
  .description('Display\'s all the tasks for current month')
  .action(function (options) {
    _handled = true;
    if (options.previous) {
      reports.month_prev();
    } else {
      reports.month();
    }
  });

program.parse(process.argv);

if (program.args.length === 0) {
  program.help();
  process.exit(1);
}

process.nextTick(function () {
  if (!_handled) {
    console.log('\n !! Unknown command !! ');
    program.help();
    process.exit();
  }
});
