'use strict';

const EventEmitter = require('events').EventEmitter;
const path = require('path');

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
    throw new Error('BaseAgent should implement getter id.');
  }

  get workerId() {
    throw new Error('BaseAgent should implement getter workerId.');
  }
}

BaseApp.BaseAppWorker = BaseAppWorker;

module.exports = BaseApp;
