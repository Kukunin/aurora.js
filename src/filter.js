// Generated by CoffeeScript 1.7.1
(function() {
  var Filter;

  Filter = (function() {
    function Filter(context, key) {
      if (context && key) {
        Object.defineProperty(this, 'value', {
          get: function() {
            return context[key];
          }
        });
      }
    }

    Filter.prototype.process = function(buffer) {};

    return Filter;

  })();

  module.exports = Filter;

}).call(this);
