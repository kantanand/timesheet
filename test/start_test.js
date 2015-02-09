const 
    assert = require('assert')
  , tasks = require('../lib/tasks');
  
describe('start', function () {
  it('should return OK on successful start', function (done) {
    tasks.start('test', function (err, data) {
      assert.equal(err, null);
      done();
    });
  });
});