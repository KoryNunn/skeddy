# skeddy
![Node.js Test Runner](https://github.com/KoryNunn/skeddy/workflows/Node.js%20Test%20Runner/badge.svg)


Simple async task scheduler with catch-up for long running tasks

## Why

If you want something to run every 10s and it takes a few seconds.

## Usage

```
const createScheduler = require('skeddy');

const scheduler = createScheduler();

scheduler.add(function () {

    return new Promise(resolve => {
        console.log(Date.now(), 'I still run approx every 3 seconds.')

        setTimeout(resolve, Math.random() * 3000)
    })
}, 3000);

```
