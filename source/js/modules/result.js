import Scene2DSeaCalf from './canvas/result-win-animate.js';
import Scene2DCrocodile from './canvas/result-lose-animate.js';

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

        if (target === `result`) {
            document.querySelector(`#resultWinAnimate`).beginElement();
            const canvasWinResult = document.getElementById(`sea-calf-scene`);
            const resultWinAnimate = new Scene2DSeaCalf({canvas:canvasWinResult});
            resultWinAnimate.startAnimation();
        } else if (target === `result2`) {
            document.querySelector(`#resultSecondAnimate`).beginElement();
        } else if (target === `result3`) {
            document.querySelector(`#resultThirdAnimate`).beginElement();
            const canvasLoseResult = document.getElementById(`crocodile-scene`);
            const resultLoseAnimate = new Scene2DCrocodile({canvas:canvasLoseResult});
            resultLoseAnimate.startAnimation();
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
