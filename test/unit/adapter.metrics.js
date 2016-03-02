var adapter = require('../../lib/adapter'),
    should = require('should'),
    support = require('./support/bootstrap');

describe('adapter', function() {
  context('when default no-op metrics are configured', function() {
    before(function(done) {
      support.Setup('test_metrics', done);
    });

    after(function(done) {
      support.Teardown('test_metrics', done);
    });

    describe('.spawnConnection()', function() {
      it('does not throw', function(done) {
        adapter.find('test', 'test_metrics', { where: { field_1: 'foo' } }, function(err, results) {
          should(err).eql(null);
          done();
        });
      });
    });
  });

  context('when custom metrics are configured', function() {
    var metrics;
    var originalConfig;

    /**
     * Setup and Teardown
     */
    before(function(done) {
      originalConfig = support.Config;

      metrics = {
        increments: [],
        measures: [],
        timings: [],

        configure: function(opts) {},
        namespace: function(name) { return name; },
        increment: function(name, value) {
          metrics.increments.push({
            name: name,
            value: value,
          });
        },
        measure: function(name, value) {
          metrics.measures.push({
            name: name,
            value: value,
          });
        },
        timing: function(name, startTime) {
          metrics.timings.push({
            name: name,
            startTime: startTime,
          });
        },
      };

      support.Config.metrics = metrics;
      support.Setup('test_metrics', done);
    });

    after(function(done) {
      support.Config = originalConfig;
      support.Teardown('test_metrics', done);
    });

    describe('.spawnConnection()', function() {
      it('captures metrics', function(done) {
        adapter.find('test', 'test_metrics', { where: { field_1: 'foo' } }, function(err, results) {
          metrics.increments.length.should.eql(4);
          metrics.measures.length.should.eql(12);
          metrics.timings.length.should.eql(8);
          done();
        });
      });
    });
  });
});
