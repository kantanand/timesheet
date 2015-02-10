const
    assert = require('assert')
  , tasks  = require('../lib/tasks')
  , redis  = require('redis').createClient();

describe('start', function () {
  const _key = 'test:' + new Date().toISOString().substr(0, 10).replace(/-/g,'');

  before(function (done) {
    tasks.login('test', done);
  });
  after(function (done) {
    redis.del(_key, done);
  });
  afterEach(function () {
    redis.del('test:current');
  });

  it('should return OK on successful start', function (done) {
    tasks.start('sometask', function (err, data) {
      assert.equal(err, null);
      assert(/.*test\$.*start task/.test(data));
      done();
    });
  });
  it('should close off previous task on start', function (done) {
    tasks.start('taska', function () {
      tasks.start('taskb', function () {
        redis.lrange(_key, 0, -1, function (err, data) {
          assert.equal(err, null, err);
          assert(/^taska:\d{13}:\d{13}:\d/.test(data));
          done();
        });
      });
    });
  });

});