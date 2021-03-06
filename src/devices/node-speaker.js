// Generated by CoffeeScript 1.7.1
(function() {
  var AudioDevice, EventEmitter, NodeSpeakerDevice,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EventEmitter = require('../core/events');

  AudioDevice = require('../device');

  NodeSpeakerDevice = (function(_super) {
    var Readable, Speaker;

    __extends(NodeSpeakerDevice, _super);

    AudioDevice.register(NodeSpeakerDevice);

    try {
      Speaker = require('speaker');
      Readable = require('stream').Readable;
    } catch (_error) {}

    NodeSpeakerDevice.supported = Speaker != null;

    function NodeSpeakerDevice(sampleRate, channels) {
      this.sampleRate = sampleRate;
      this.channels = channels;
      this.refill = __bind(this.refill, this);
      this.speaker = new Speaker({
        channels: this.channels,
        sampleRate: this.sampleRate,
        bitDepth: 32,
        float: true,
        signed: true
      });
      this.buffer = null;
      this.currentFrame = 0;
      this.ended = false;
      this.input = new Readable;
      this.input._read = this.refill;
      this.input.pipe(this.speaker);
    }

    NodeSpeakerDevice.prototype.refill = function(n) {
      var arr, buffer, frame, len, offset, _i, _len;
      buffer = this.buffer;
      len = n / 4;
      arr = new Float32Array(len);
      this.emit('refill', arr);
      if (this.ended) {
        return;
      }
      if ((buffer != null ? buffer.length : void 0) !== n) {
        this.buffer = buffer = new Buffer(n);
      }
      offset = 0;
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        frame = arr[_i];
        buffer.writeFloatLE(frame, offset);
        offset += 4;
      }
      this.input.push(buffer);
      return this.currentFrame += len / this.channels;
    };

    NodeSpeakerDevice.prototype.destroy = function() {
      this.ended = true;
      return this.input.push(null);
    };

    NodeSpeakerDevice.prototype.getDeviceTime = function() {
      return this.currentFrame;
    };

    return NodeSpeakerDevice;

  })(EventEmitter);

}).call(this);
