import { inRange } from 'lodash'
const _DEFAULT_OSC_TYPE = 'sine'
const _DEFAULT_BUZZ_FREQ = 550
const _DEFAULT_VOLUME = 50

const _MAX_FREQ = 20000  // protect ear
const _EASE_AMOUNT = 0.002  // prevent clicking effect

class AudioBuzzer {
  constructor({
    type = _DEFAULT_OSC_TYPE,
    frequency = _DEFAULT_BUZZ_FREQ,
    volume = _DEFAULT_VOLUME,
  }) {
    // Create an audio context for playing beeps
    this.audioCtx = new (window.AudioContext ||
      window.webkitAudioContext ||
      window.audioContext)()
    this.audioCtx.suspend()

    // Create an gain node to open and close beeps smoothly
    this.smootherGain = this.audioCtx.createGain();
    this.smootherGain.gain.value = 0;
    this.smootherGain.connect(this.audioCtx.destination);

    // Create volume gain node
    this.volumeGain = this.audioCtx.createGain();
    this.volume = volume
    this.volumeGain.connect(this.smootherGain);

    // Create oscillator to generate beep.
    // these param can be change afterwards
    this.oscillator = this.audioCtx.createOscillator();
    this.osc_type = type;
    this.frequency = frequency; // value in hertz
    this.oscillator.start();
    this.oscillator.connect(this.volumeGain);

    this.warn('Audio Context Created and ready.', type = 'AU')
  }

  warn(message = '', type = 'AU WARN') {
    console.log(`[${type}] ${message}`)
  }

  resumePlay() {
    if ((this.audioCtx.state === "suspended")) {
      this.audioCtx.resume();
    }
  }
  stop() {
    this.oscHandle('stop')
  }
  start() {
    this.oscHandle('start')
  }
  oscHandle(type = "start") {
    const current = this.audioCtx.currentTime;
    switch (type) {
      case "start":
        this.smootherGain.gain.setTargetAtTime(1, current, _EASE_AMOUNT);
        break;
      case "stop":
        this.smootherGain.gain.setTargetAtTime(0, current, _EASE_AMOUNT);
        break;
    }
  }
  // Volume
  set volume(vol = _DEFAULT_VOLUME) {
    if (0 <= vol <= 100) {
      const current = this.audioCtx.currentTime
      const val = ((vol / 10) ** 2) / 100
      this.volumeGain.gain.setTargetAtTime(val, current, _EASE_AMOUNT);
    } else {
      this.warn(`${vol} is not valid for volume.`)
    }
  }
  get volume() {
    return (this.volumeGain.gain.value * 100) ** 0.5 / 10
  }

  //Frequency
  set frequency(freq = _DEFAULT_BUZZ_FREQ) {
    if (inRange(freq, 1, _MAX_FREQ)) {
      this.oscillator.frequency.value = freq
    } else {
      this.warn(`${freq} is not a valid value for frequency.`)
    }
  }
  get frequency() {
    return this.oscillator.frequency.value
  }

  // OSC Type
  get osc_type() {
    return this.oscillator.type
  }
  set osc_type(type) {
    try {
      this.oscillator.type = type
    } catch (e) {
      this.warn(`${type} invalid for osc type`)
    }
  }

  destroyed() {
    if (this.audioCtx) {
      this.audioCtx.close().then(() => console.log("AU Ctx Closed."));
    }
  }
}

export default AudioBuzzer