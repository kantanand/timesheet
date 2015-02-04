# Timesheet

A simple service for logging activity for your timesheet. The requirements are that the interface is command-line driven (initially) and very simple to use.

The problem with many of the timesheet management tools today is that they're too complicate or don't give you the control where you need it.

Here's a proposed command set for an initial version:

#### Start a new task

    $ timesheet start <taskname> [time]

It should be easy to start a new task, simply type the name a new task will begin. If there is an already running task, it will be stopped and the new one started. If no `time` parameter is specified, the app uses the current time.

#### Stop a task

    $ timesheet stop

There should be no need to say what task to stop as you can only be doing one task at a time. Therefore, the current task is stopped.

#### Cancel a task

    $ timesheet cancel

To cancel a running task, and remove any time tracked for it, simply call cancel. There should be no need to say what task to cancel as you can only be doing one task at a time. Therefore, the current task is cancelled.

#### Add an Ad-hoc Task

    $ timesheet add <taskname> <start-date-time> <duration>

To insert an ad-hoc or arbitrary task, simple add the name of the task, the start date and time in the ISO date/time format (`YYYY-mm-dd HH:MM:SS`) and how long the task took in minutes.

#### Reports

At any time you can report on what task is active:

    $ timesheet current

What the previous task was:

    $ timesheet last

What tasks have been done today:

    $ timesheet today

What tasks have been done this week:

    $ timesheet week

What tasks have been done this month:

    $ timesheet month

With both the `week` and `month` reports you can optionally ask to report on the previous period (`--prev [number]`), you can specify a number to back that many periods. For example to go back to last month:

    $ timesheet month --prev 1

To go back to the month before last:

    $ timesheet month --prev 2

If you don't specify a number the report will use `1`. 

##### Formatting

The standard output for the report is a list, where each item is a task grouped into days. However, you can on the `month` and `week` reports use a `--csv` switch to output the report in CSV format.