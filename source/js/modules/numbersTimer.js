export default class NumbersTimer {
  constructor(numberContainer, start, end, step) {
    this._element = numberContainer;
    this._startNumber = start;
    this._endNumber = end;
    this._step = step;
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
