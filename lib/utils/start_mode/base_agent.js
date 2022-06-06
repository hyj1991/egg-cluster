'use strict';

const path = require('path');

class BaseAgent {
  constructor(options, { log, logger, messenger }) {
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

  send() {
    throw new Error('BaseAgent should implement send.');
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

  get id() {
    throw new Error('BaseAgent should implement getter id.');
  }

  get workerId() {
    throw new Error('BaseAgent should implement getter workerId.');
  }

  setId(id) {
    this.instance.id = id;
  }
}

BaseAgent.BaseAgentWorker = BaseAgentWorker;

module.exports = BaseAgent;
