# process-stopwatch
A simple stopwatch module for nodeJS using the process timer.  Allows for resetting of timer and for creating and working with time splits.  This is not guaranteed to be a highly accurate timer, merely a utility for simple time-keeping.  If you need a highly accurate process timer, you should look elsewhere.  

Also, this module is in active development and is mostly being used in my projects, so it may not work 100%.  I'm planning to add tests sometime soon.

## Installation

Simply

```bash
npm install process-stopwatch
```

## Usage

### Basic Usage

The timer's basic usage is to start, read, reset and end the timer, as you'd expect to be able to do with any stopwatch.  It does not currently offer a pause capability, but one may be implemented in the future.

```js
const { Timer } = require('process-stopwatch')

const timer = new Timer()

// Start the timer
timer.start() // => JS Date reflecting time started

// Get that start date again
timer.startDate // => That start date again

// Read the time
const time = timer.read() // => Time object reflecting time elapsed

// Accessing time values from Time objects
time.raw // => process.hrtime output array
time.millis // => duration in milliseconds
time.nanos // => duration in nanoseconds

// Reset the timer
timer.reset() // => Time object reflecting time when reset
timer.read() // => Time object reflecing time since reset

// Stop the timer
timer.stop()
```

### Advanced Usage

More advanced usage can be done with splits, which create saved points in time on the timer, which can be accessed and worked with.  Note that `reset()` may not work as expected with splits, as it will only affect the current timer time reference.  All splits will be calculated based on time from timer start, and will not take into account timer resets.  However, `reset()` can still be used to provide in-progress time tracking, as is shown in an example below.

The decision to ignore resets within the splits was made to avoid making the module opinionated on how to handle it.  If you need an implementation that does account for resets in splits, you should be able to use the functionality of this module to implement it using some combination of the split getters with `since()` and `between()`, or by using multiple timers.

```js
// Add a split
timer.split('split1') // => Time object reflecting time when split

// Add a split and restart the timer
timer.split('split2', { reset: true }) // => Time object reflecting time when split

// Log the time since the timer reset on split2
timer.read() // => Time object reflecting time elapsed since last reset

// Log it every second
setTimeout(() => console.log(timer.read()), 1000)

// Get splits
timer.splits
/* => [
    [ 'start', Time for timer start,
    [ 'split1', Time split1 was created,
    [ 'split2', TTime split2 was created,
    ...
] */

// Get diffs
timer.diffs
/* => [
    [ 'start', Time between start and start (hopefully 0) ],
    [ 'split1', Time between start and split1 ],
    [ 'split2', Time between split1 and split2 ],
    ...
] */

// Get time since start
timer.since() // => Time since start

// Get time since split1
timer.since('split1') // => Time since split1

// Get time between split1 and split2
timer.between('split1', 'split2') // => Time from split1 to split2

// Get total time over life of timer
timer.between('start', 'end')
```