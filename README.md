# Timesheet

A simple service for logging activity for your timesheet. The requirements are that the interface is command-line driven (initially) and very simple to use.

The problem with many of the timesheet management tools today is that they're too complicate or don't give you the control where you need it.

Here's a proposed command set for an initial version:

#### Login

    $ timesheet login <username>

All data should be scoped to a single user, therefore, it is necessary for a user to be logged in. This also enables multiple users to use the system at the same time.

#### Start a new task

    $ timesheet start <taskname> [time]

It should be easy to start a new task, simply type the name a new task will begin. If there is an already running task, it will be stopped and the new one started. If no `time` parameter is specified, the app uses the current time.

#### Stop a task

    $ timesheet stop [time]

There should be no need to say what task to stop as you can only be doing one task at a time. Therefore, the current task is stopped.

#### Cancel a task

    $ timesheet cancel

To cancel a running task, and remove any time tracked for it, simply call cancel. There should be no need to say what task to cancel as you can only be doing one task at a time. Therefore, the current task is cancelled.

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
