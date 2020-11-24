const test = require('tape-catch');
const createScheduler = require('../');

const interval = 100;
const testRunnerTolerance = 1.3;

test('schedule job', async t => {
  t.plan(6);

  const scheduler = createScheduler();

  const startTime = Date.now();

  let runCount = 0;

  scheduler.add(function () {
    runCount++;
    const ellapsed = Date.now() - startTime;

    if (runCount === 1) {
      t.ok(ellapsed >= interval * 1);
      t.ok(ellapsed <= interval * 1 * testRunnerTolerance);
    }

    if (runCount === 2) {
      t.ok(ellapsed >= interval * 2);
      t.ok(ellapsed <= interval * 2 * testRunnerTolerance);
    }

    if (runCount === 3) {
      t.ok(ellapsed >= interval * 3);
      t.ok(ellapsed <= interval * 3 * testRunnerTolerance);
      scheduler.cancelAndStop();
    }
  }, interval);
});

test('long jobs maintain interval', async t => {
  t.plan(6);

  const scheduler = createScheduler();

  const startTime = Date.now();

  let runCount = 0;

  scheduler.add(async function () {
    runCount++;
    const ellapsed = Date.now() - startTime;

    if (runCount === 1) {
      t.ok(ellapsed >= interval * 1);
      t.ok(ellapsed <= interval * 1 * testRunnerTolerance);
      await new Promise(resolve => setTimeout(resolve, interval / 2));
    }

    if (runCount === 2) {
      t.ok(ellapsed >= interval * 2);
      t.ok(ellapsed <= interval * 2 * testRunnerTolerance);
    }

    if (runCount === 3) {
      t.ok(ellapsed >= interval * 3);
      t.ok(ellapsed <= interval * 3 * testRunnerTolerance);
      scheduler.cancelAndStop();
    }
  }, interval);
});

test('very long jobs run as fast as they can', async t => {
  t.plan(1);

  const scheduler = createScheduler();

  let runCount = 0;
  let lastRunEnd;

  scheduler.add(async function () {
    runCount++;
    if (runCount === 1) {
      await new Promise(resolve => setTimeout(resolve, interval * 2));
      lastRunEnd = Date.now();
    }

    if (runCount === 2) {
      t.ok(Date.now() - lastRunEnd <= 5);
      scheduler.cancelAndStop();
    }
  }, interval);
});