'use strict';

const childprocess = require('child_process');
const co = require('co');
const semver = require('semver');
const sendmessage = require('sendmessage');

const BaseAgent = require('../BaseAgent');
const terminate = require('../../terminate');

class Agent extends BaseAgent {
  constructor(...args) {
    super(...args);

    // private
    this.worker = null;
  }

  get worker_id() {
    return this.worker.pid;
  }

  send(data) {
    sendmessage(this.worker, data);
  }

  fork() {
    this.agentStartTime = Date.now();

    const args = [ JSON.stringify(this.options) ];
    const opt = {};

    if (process.platform === 'win32') opt.windowsHide = true;

    // add debug execArgv
    const debugPort = process.env.EGG_AGENT_DEBUG_PORT || 5800;
    if (this.options.isDebug) opt.execArgv = process.execArgv.concat([ `--${semver.gte(process.version, '8.0.0') ? 'inspect' : 'debug'}-port=${debugPort}` ]);

    const worker = this.worker = childprocess.fork(this.getAgentWorkerFile(), args, opt);
    this.status = 'starting';
    this.id++;
    this.log('[master] agent_worker#%s:%s start with clusterPort:%s',
      worker.id, worker.pid, this.options.clusterPort);

    // send debug message
    if (this.options.isDebug) {
      this.messenger.send({
        to: 'parent',
        from: 'agent',
        action: 'debug',
        data: {
          debugPort,
          pid: worker.pid,
        },
      });
    }
    // forwarding agent' message to messenger
    worker.on('message', msg => {
      if (typeof msg === 'string') {
        msg = {
          action: msg,
          data: msg,
        };
      }
      msg.from = 'agent';
      this.messenger.send(msg);
    });
    worker.on('error', err => {
      err.name = 'AgentWorkerError';
      err.id = worker.id;
      err.pid = worker.pid;
      this.logger.error(err);
    });
    // agent exit message
    worker.once('exit', (code, signal) => {
      this.messenger.send({
        action: 'agent-exit',
        data: {
          code,
          signal,
        },
        to: 'master',
        from: 'agent',
      });
    });
  }

  clean() {
    this.worker.removeAllListeners();
  }

  kill(timeout) {
    if (!this.worker) {
      return Promise.resolve(null);
    }

    this.log('[master] kill agent worker with signal SIGTERM');
    this.clean();
    return co(function* () {
      yield terminate(this.worker, timeout);
    });
  }
}

module.exports = Agent;
