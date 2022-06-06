'use strict';

const path = require('path');
const EventEmitter = require('events').EventEmitter;

class BaseApp extends EventEmitter {
  constructor(options, { log, logger, messenger }) {
    super();
    this.options = options;
    this.log = log;
    this.logger = logger;
    this.messenger = messenger;

    // public attrs
    this.startTime = 0;
    this.startSuccessCount = 0;
    this.isAllWorkerStarted = false;
  }

  getAppWorkerFile() {
    return path.join(__dirname, '../../app_worker.js');
  }

  fork() {
    throw new Error('BaseApp should implement fork.');
  }
}

class BaseAppWorker {
  constructor(instance) {
    this.instance = instance;
  }

  get id() {
    throw new Error('BaseAppWorker should implement getter id.');
  }

  get workerId() {
    throw new Error('BaseAppWorker should implement getter workerId.');
  }

  get state() {
    throw new Error('BaseAppWorker should implement getter state.');
  }

  send() {
    throw new Error('BaseAppWorker should implement send.');
  }
}

BaseApp.BaseAppWorker = BaseAppWorker;

module.exports = BaseApp;
