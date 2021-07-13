export default class NumbersTimer {
  constructor(options) {
    this._element = options.numberContainer;
    this._startNumber = options.start;
    this._endNumber = options.end;
    this._step = options.step;
    this._currentNumber = this._startNumber;
    this._fpsInterval = 1000 / 10;
    this._then = Date.now();
    this._startTick = false;
  }

  startTimer() {
    this.tick();
  }

  stopTimer() {
    cancelAnimationFrame(this.tickerRequest);
  }

  tick() {
    this.tickerRequest = requestAnimationFrame(() => {
      const now = Date.now();

      const elapsed = now - this._then;
      if (elapsed > this._fpsInterval) {
        this._then = now - (elapsed % this._fpsInterval);

        if (!this._startTick) {
          this._startTick = true;
        } else if (this._endNumber - this._currentNumber < this._step) {
          this._currentNumber = this._endNumber;
        } else {
          this._currentNumber += this._step;
        }

        this.draw(this._currentNumber);

        if (this._currentNumber >= this._endNumber) {
          this.stopTimer();
          return;
        }
      }
      this.tick();
    });
  }

  draw(number) {
    this._element.innerText = number;
  }
}
