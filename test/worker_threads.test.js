'use strict';

const utils = require('./utils');
const { canIuseWorkerThreads } = require('../lib/utils/start_mode/worker_threads/utils');

(canIuseWorkerThreads ? describe : describe.skip)('worker_threads', () => {
  let app;

  describe('Fork Agent', () => {
    afterEach(() => app.close());

    it('support config agent debug port', async () => {
      app = utils.cluster('apps/agent-worker-threads', { startMode: 'worker_threads' });
      app.debug();
      return app
        .expect('stdout', /workerId: 1/)
        .end();
    });

    it('should exit when emit error during agent worker boot', () => {
      app = utils.cluster('apps/agent-worker-threads-error');
      app.debug();
      return app
        .debug()
        .expect('code', 1)
        .expect('stderr', /worker_threads mock error/)
        .expect('stderr', /\[agent_worker\] start error, exiting with code:1/)
        .expect('stderr', /\[master\] exit with code:1/)
        .end();
    });
  });
});
