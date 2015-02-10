const
    assert = require('assert')
  , tasks = require('../lib/tasks');
  
describe('login', function () {
  it('should return OK on successful login', function (done) {
    tasks.login('test', function (err, data) {
      assert.equal(err, null);
      assert(/.*test\$.*ok/.test(data));
      done();
    });
  });
  it('should fail with missing username', function (done) {
    try {
      tasks.login(null);
    } catch (e) {
      assert(e);
      assert.equal(e.name, 'AssertionError');
    }
    done();
  });
});