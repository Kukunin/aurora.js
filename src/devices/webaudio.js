// Generated by CoffeeScript 1.7.1
(function() {
  var AudioDevice, EventEmitter, Resampler, WebAudioDevice,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EventEmitter = require('../core/events');

  AudioDevice = require('../device');

  Resampler = require('./resampler');

  WebAudioDevice = (function(_super) {
    var AudioContext, createProcessor, sharedContext;

    __extends(WebAudioDevice, _super);

    AudioDevice.register(WebAudioDevice);

    AudioContext = global.AudioContext || global.webkitAudioContext;

    WebAudioDevice.supported = AudioContext && (typeof AudioContext.prototype[createProcessor = 'createScriptProcessor'] === 'function' || typeof AudioContext.prototype[createProcessor = 'createJavaScriptNode'] === 'function');

    sharedContext = null;

    WebAudioDevice.deviceSampleRate = function() {
      var context;
      context = sharedContext != null ? sharedContext : sharedContext = new AudioContext;
      return context.sampleRate;
    };

    function WebAudioDevice(sampleRate, channels, options) {
      this.sampleRate = sampleRate;
      this.channels = channels;
      this.options = options;
      this.refill = __bind(this.refill, this);
      this.context = sharedContext != null ? sharedContext : sharedContext = new AudioContext;
      this.deviceSampleRate = this.context.sampleRate;
      this.deviceBufferSize = this.options.bufferSize || 4096;
      this.bufferSize = Math.ceil(this.deviceBufferSize / (this.deviceSampleRate / this.sampleRate) * this.channels);
      this.bufferSize += this.bufferSize % this.channels;
      if (this.deviceSampleRate !== this.sampleRate) {
        this.resampler = new Resampler(this.sampleRate, this.deviceSampleRate, this.channels, this.bufferSize);
      }
      this.node = this.context[createProcessor](this.deviceBufferSize, this.channels, this.channels);
      this.node.onaudioprocess = this.refill;
      this.node.connect(this.context.destination);
    }

    WebAudioDevice.prototype.refill = function(event) {
      var channelCount, channels, data, i, n, outputBuffer, _i, _j, _k, _ref;
      outputBuffer = event.outputBuffer;
      channelCount = outputBuffer.numberOfChannels;
      channels = new Array(channelCount);
      for (i = _i = 0; _i < channelCount; i = _i += 1) {
        channels[i] = outputBuffer.getChannelData(i);
      }
      data = new Float32Array(this.bufferSize);
      this.emit('refill', data);
      if (this.resampler) {
        data = this.resampler.resampler(data);
      }
      for (i = _j = 0, _ref = outputBuffer.length; _j < _ref; i = _j += 1) {
        for (n = _k = 0; _k < channelCount; n = _k += 1) {
          channels[n][i] = data[i * channelCount + n];
        }
      }
    };

    WebAudioDevice.prototype.destroy = function() {
      return this.node.disconnect(0);
    };

    WebAudioDevice.prototype.getDeviceTime = function() {
      return this.context.currentTime * this.sampleRate;
    };

    return WebAudioDevice;

  })(EventEmitter);

}).call(this);
