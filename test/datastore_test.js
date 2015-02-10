const
    assert = require('assert')
  , ds     = require('../lib/datastore')
  , redis  = require('redis').createClient();

describe('datastore', function () {
  const user = 'dstest', task = 'sometask';

  after(function (done) {
    redis.del(user + ':current', done);
  });

  it('should set current', function (done) {
    const set_current = ds.set_current(user, task);
    set_current(function (err, data) {
      assert.equal(err, null, err);
      assert.equal(data, 'OK');
      done();
    });
  });
  it('should get current', function (done) {
    const set_current = ds.set_current(user, task);
    const get_current = ds.current(user);
    set_current(function () {
      get_current(function (err, data) {
        assert.equal(data, task);
        done();
      });
    });
  });
  it('should return null for missing current', function (done) {
    ds.current('does_not_exist_test')(function (err, data) {
      assert.equal(err, null, err);
      assert.equal(data, null);
      done();
    });
  });
});