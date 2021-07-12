export default class Timer {
  constructor(gameContainer) {
    this._TIME = 5 * 60 * 1000;
    this._minContainer = gameContainer.children[0];
    this._secContainer = gameContainer.children[1];
    this._fpsInterval = 1000 / 60;
    this._then = Date.now();
  }

  startTimer() {
    this._start = Date.now();
    this.tick();
  }

  stopTimer() {
    cancelAnimationFrame(this.tickerRequest);
  }

  tick() {
    this.tickerRequest = requestAnimationFrame(() => {
      const now = Date.now();
      let time = this._TIME - (now - this._start);
      let min = Math.floor(time / 1000 / 60);
      let sec = Math.floor((time / 1000) % 60);

      const elapsed = now - this._then;

      if (elapsed > this._fpsInterval) {
        this._then = now - (elapsed % this._fpsInterval);
        this.draw(min, sec);

        if (min === 0 && sec === 0) {
          this.stopTimer();
          return;
        }
      }
      this.tick();
    });
  }

  draw(min, sec) {
    if (min < 10) {
      this._minContainer.innerText = `0${min}`;
    } else {
      this._minContainer.innerText = min;
    }
    if (sec < 10) {
      this._secContainer.innerText = `0${sec}`;
    } else {
      this._secContainer.innerText = sec;
    }
  }
}
