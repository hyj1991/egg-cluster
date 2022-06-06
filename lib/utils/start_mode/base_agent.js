'use strict';

const path = require('path');
const EventEmitter = require('events').EventEmitter;

class BaseAgent extends EventEmitter {
  constructor(options, { log, logger, messenger }) {
    super();
    this.options = options;
    this.log = log;
    this.logger = logger;
    this.messenger = messenger;

    // public attrs
    this.startTime = 0;
    this.status = null;
    this.instance = null;
  }

  getAgentWorkerFile() {
    return path.join(__dirname, '../../agent_worker.js');
  }

  fork() {
    throw new Error('BaseAgent should implement fork.');
  }

  clean() {
    throw new Error('BaseAgent should implement clean.');
  }

  kill() {
    throw new Error('BaseAgent should implement kill.');
  }
}

class BaseAgentWorker {
  constructor(instance) {
    this.instance = instance;
  }

  get workerId() {
    throw new Error('BaseAgentWorker should implement getter workerId.');
  }

  get id() {
    return this.instance.id;
  }

  setId(id) {
    this.instance.id = id;
  }

  send() {
    throw new Error('BaseAgentWorker should implement send.');
  }
}

BaseAgent.BaseAgentWorker = BaseAgentWorker;

module.exports = BaseAgent;
