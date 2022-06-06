'use strict';

const path = require('path');

class BaseAgent {
  constructor(options, { log, logger, messenger }) {
    this.options = options;
    this.log = log;
    this.logger = logger;
    this.messenger = messenger;

    // public attrs
    this.id = 0;
    this.startTime = 0;
    this.status = null;
  }

  getAgentWorkerFile() {
    return path.join(__dirname, '../../agent_worker.js');
  }

  get workerId() {
    throw new Error('BaseAgent should implement getter workerId.');
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

module.exports = BaseAgent;
