'use strict';

const path = require('path');

class BaseAgent {
  constructor(options, { log, messenger }) {
    this.options = options;
    this.status = null;
    this.id = 0;
    this.log = log;
    this.messenger = messenger;
  }

  getAgentWorkerFile() {
    return path.join(__dirname, '../../agent_worker.js');
  }

  get worker_id() {
    throw new Error('BaseAgent should implement getter worker_id.');
  }

  send() {
    throw new Error('BaseAgent should implement send.');
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

module.exports = BaseAgent;
