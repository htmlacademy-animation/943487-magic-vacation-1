import Scene2DSeaCalf from './canvas/result-first-animate.js';

export default () => {
  let showResultEls = document.querySelectorAll(`.js-show-result`);
  let results = document.querySelectorAll(`.screen--result`);
  if (results.length) {
    for (let i = 0; i < showResultEls.length; i++) {
      showResultEls[i].addEventListener(`click`, function () {
        let target = showResultEls[i].getAttribute(`data-target`);
        [].slice.call(results).forEach(function (el) {
          el.classList.remove(`screen--show`);
          el.classList.add(`screen--hidden`);
        });
        let targetEl = [].slice.call(results).filter(function (el) {
          return el.getAttribute(`id`) === target;
        });
        targetEl[0].classList.add(`screen--show`);
        targetEl[0].classList.remove(`screen--hidden`);

        if (target === "result") {
            document.querySelector(`#resultFirstAnimate`).beginElement();
            const canvasFirstResult = document.getElementById("sea-calf-scene");
            const resultFirstAnimate = new Scene2DSeaCalf({canvas:canvasFirstResult});
            resultFirstAnimate.startAnimation();
        } else if (target === "result2") {
            document.querySelector(`#resultSecondAnimate`).beginElement();
        } else if (target === "result3") {
            document.querySelector(`#resultThirdAnimate`).beginElement();
        }
      });
    }

    let playBtn = document.querySelector(`.js-play`);
    if (playBtn) {
      playBtn.addEventListener(`click`, function () {
        [].slice.call(results).forEach(function (el) {
          el.classList.remove(`screen--show`);
          el.classList.add(`screen--hidden`);
        });
        document.getElementById(`messages`).innerHTML = ``;
        document.getElementById(`message-field`).focus();
      });
    }
  }
};
