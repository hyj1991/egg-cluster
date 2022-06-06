'use strict';

let workerThreads = null;
let isMainThread = true;
let threadId = 0;
let canIuseWorkerThreads = false;

try {
  workerThreads = require('worker_threads');
  isMainThread = workerThreads.isMainThread;
  threadId = workerThreads.threadId;
  canIuseWorkerThreads = true;

} catch (err) /* istanbul ignore next */ {
  err;
}

module.exports = {
  workerThreads,
  isMainThread,
  threadId,
  canIuseWorkerThreads,
};
