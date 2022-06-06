'use strict';

const cluster = require('cluster');
const cfork = require('cfork');

const BaseApp = require('../base_app');

class AppWorker extends BaseApp.BaseAppWorker {
  get id() {
    return this.instance.id;
  }

  get workerId() {
    return this.instance.process.pid;
  }
}

class App extends BaseApp {
  fork() {
    this.startTime = Date.now();
    this.isAllWorkerStarted = false;
    this.startSuccessCount = 0;

    const args = [ JSON.stringify(this.options) ];
    this.log('[master] start appWorker with args %j', args);
    cfork({
      exec: this.getAppWorkerFile(),
      args,
      silent: false,
      count: this.options.workers,
      // don't refork in local env
      refork: this.isProduction,
      windowsHide: process.platform === 'win32',
    });

    let debugPort = process.debugPort;
    cluster.on('fork', worker => {
      const appWorker = new AppWorker(worker);
      this.emit('worker_forked', appWorker);
      worker.disableRefork = true;
      worker.on('message', msg => {
        if (typeof msg === 'string') {
          msg = {
            action: msg,
            data: msg,
          };
        }
        msg.from = 'app';
        this.messenger.send(msg);
      });
      this.log('[master] app_worker#%s:%s start, state: %s, current workers: %j',
        worker.id, worker.process.pid, worker.state, Object.keys(cluster.workers));

      // send debug message, due to `brk` scence, send here instead of app_worker.js
      if (this.options.isDebug) {
        debugPort++;
        this.messenger.send({
          to: 'parent',
          from: 'app',
          action: 'debug',
          data: {
            debugPort,
            workerId: worker.process.pid,
          },
        });
      }
    });
    cluster.on('disconnect', worker => {
      this.logger.info('[master] app_worker#%s:%s disconnect, suicide: %s, state: %s, current workers: %j',
        worker.id, worker.process.pid, worker.exitedAfterDisconnect, worker.state, Object.keys(cluster.workers));
    });
    cluster.on('exit', (worker, code, signal) => {
      this.messenger.send({
        action: 'app-exit',
        data: {
          workerPid: worker.process.pid,
          code,
          signal,
        },
        to: 'master',
        from: 'app',
      });
    });
    cluster.on('listening', (worker, address) => {
      this.messenger.send({
        action: 'app-start',
        data: {
          workerPid: worker.process.pid,
          address,
        },
        to: 'master',
        from: 'app',
      });
    });

    return this;
  }
}

module.exports = App;
