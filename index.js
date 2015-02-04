#!/usr/bin/env node

var assert  = require('assert')
  , program = require('commander')
  , pkg     = require('./package')
  , tasks   = require('./lib/tasks');

program.version(pkg.version);
program
  .command('start <taskname> [time]')
  .description('Starts a new task with the name')
  .action(function (taskname, time) {
    assert(taskname);
    tasks.start(taskname, time);
  });

program
  .command('stop')
  .description('Stops the current task')
  .action(function () {
    console.log(arguments);
  });

program
  .command('cancel')
  .description('Cancels the current task')
  .action(function () {
    console.log(arguments);
  });

program
  .command('add <taskname> <start> <duration>')
  .description('Add a new task with an arbitrary start date and duration')
  .action(function (taskname, start, duration) {
    assert(taskname);
    assert(start);
    assert(duration);

    console.log(arguments);
  });

program
  .command('current')
  .description('Display\'s the current task information')
  .action(function () {
    console.log(arguments);
  });

program
  .command('last')
  .description('Display\'s the last completed task')
  .action(function () {
    console.log(arguments);
  });

program
  .command('today')
  .description('Display\'s all the tasks for today')
  .action(function () {
    console.log(arguments);
  });

program
  .command('week')
  .description('Display\'s all the tasks for current week')
  .option('-p, --prev [number]', 'Specify the number of weeks to go back', 1)
  .action(function (options) {
    assert(options);

    console.log(arguments);
  });

program
  .command('month')
  .description('Display\'s all the tasks for current month')
  .option('-p, --prev [number]', 'Specify the number of months to go back', 1)
  .option('-c, --csv', 'Output in CSV format')
  .action(function (options) {
    assert(options);

    console.log(arguments);
  });

program.parse(process.argv);