const
    assert  = require('assert')
  , ds      = require('../lib/datastore')
  , reports = require('../lib/reports')
  , redis  = require('redis').createClient();

describe('reports', function () {
  afterEach(function () {
    redis.del('test:current');
  });
  
  describe('current', function () {
    it('should return `None` if no current task', function (done) {
      reports.current(function (err, data) {
        assert.equal(err, null, err);
        assert(/None/.test(data));
        done();
      });
    });
    it('should return current task', function (done) {
      ds.set_current('test', 'sample_task')(function (err) {
        assert.equal(err, null, err);
        reports.current(function (err, data) {
          assert.equal(err, null, err);
          assert(/sample_task/.test(data));
          done();
        });
      });
    });
  });
});