const tick = (from, to, progress) => from + progress * (to - from);

const animateProgress = (render, duration) =>
  new Promise((resolve) => {
    let start = Date.now();
    (function loop() {
      let time = (Date.now() - start) / duration;
      if (time > 1) {
        render(1);
        resolve(true);
      } else {
        requestAnimationFrame(loop);
        render(time);
      }
    })();
  });

const animateWithFPS = (render, duration, easing, fps = 1000 / 25) =>
  new Promise((resolve) => {
    let start = null;
    let lastFrameUpdateTime = null;
    let timeSinceLastUpdate = null;

    function loop(currentTime) {
      if (!start) {
        start = currentTime;
      }

      if (!lastFrameUpdateTime) {
        lastFrameUpdateTime = currentTime;
      }

      let progress = (currentTime - start) / duration;
      if (progress > 1) {
        render(easing(1));
        resolve(true);
        return;
      }

      timeSinceLastUpdate = currentTime - lastFrameUpdateTime;
      if (timeSinceLastUpdate > fps) {
        lastFrameUpdateTime = currentTime;

        render(easing(progress));
      }

      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
  });

const paramAnimate = Object.freeze({
  tick,
  animateProgress,
  animateWithFPS,
});

export default paramAnimate;
