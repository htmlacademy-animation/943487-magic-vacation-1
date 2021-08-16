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

const paramAnimate = Object.freeze({
  tick,
  animateProgress,
});

export default paramAnimate;
