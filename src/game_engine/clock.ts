export class Clock {
  private _tick: (time: number) => void;
  private _timespans: number[] = [];
  private _startTime = 0;
  private _isRunning = false;
  private _loopFrame = 0;

  get isRunning() {
    return this._isRunning;
  }

  constructor(tick: (time: number) => void) {
    this._tick = tick;
  }

  start() {
    if (!this._isRunning) {
      this._isRunning = true;
      this._startTime = performance.now();
      this._loop();
    }
    return this.getTime();
  }

  private _loop() {
    this._tick(this.getTime());
    this._loopFrame = requestAnimationFrame(this._loop);
  }

  stop() {
    if (this._isRunning) {
      cancelAnimationFrame(this._loopFrame);

      this._isRunning = false;
      this._timespans.push(performance.now() - this._startTime);
    }

    return this.getTime();
  }

  getTime() {
    let time = 0;

    for (let x = 0; x < this._timespans.length; x++) {
      time += this._timespans[x];
    }

    this._timespans.length = 0;
    this._timespans.push(time);

    if (this.isRunning) {
      time += performance.now() - this._startTime;
    }

    return time;
  }
}
