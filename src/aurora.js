// Generated by CoffeeScript 1.7.1
(function() {
  var key, val, _ref;

  _ref = require('./aurora_base');
  for (key in _ref) {
    val = _ref[key];
    exports[key] = val;
  }

  require('./demuxers/caf');

  require('./demuxers/m4a');

  require('./demuxers/aiff');

  require('./demuxers/wave');

  require('./demuxers/au');

  require('./decoders/lpcm');

  require('./decoders/xlaw');

}).call(this);
