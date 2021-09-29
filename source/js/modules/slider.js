import Swiper from "swiper";
import Story from './three/story-scene.js';

export default () => {
  let storySlider;
  let storyScene = new Story();

  const setSlider = function () {
    if (((window.innerWidth / window.innerHeight) < 1) || window.innerWidth < 769) {
      storySlider = new Swiper(`.js-slider`, {
        pagination: {
          el: `.swiper-pagination`,
          type: `bullets`
        },
        keyboard: {
          enabled: true
        },
        on: {
          slideChange: () => {
            if (storySlider.activeIndex === 0 || storySlider.activeIndex === 1) {
                storyScene.renderScene(0);
            } else if (storySlider.activeIndex === 2 || storySlider.activeIndex === 3) {
                storyScene.renderScene(1);
            } else if (storySlider.activeIndex === 4 || storySlider.activeIndex === 5) {
                storyScene.renderScene(2);
            } else if (storySlider.activeIndex === 6 || storySlider.activeIndex === 7) {
                storyScene.renderScene(3);
            }
          },
          resize: () => {
            storySlider.update();
          }
        },
        observer: true,
        observeParents: true
      });
    } else {
      storySlider = new Swiper(`.js-slider`, {
        slidesPerView: 2,
        slidesPerGroup: 2,
        pagination: {
          el: `.swiper-pagination`,
          type: `fraction`
        },
        navigation: {
          nextEl: `.js-control-next`,
          prevEl: `.js-control-prev`,
        },
        keyboard: {
          enabled: true
        },
        on: {
          slideChange: () => {
            if (storySlider.activeIndex === 0) {
                storyScene.renderScene(0);
            } else if (storySlider.activeIndex === 2) {
                storyScene.renderScene(1);
            } else if (storySlider.activeIndex === 4) {
                storyScene.renderScene(2);
            } else if (storySlider.activeIndex === 6) {
                storyScene.renderScene(3);
            }
          },
          resize: () => {
            storySlider.update();
          }
        },
        observer: true,
        observeParents: true
      });
    }
  };

  window.addEventListener(`resize`, function () {
    if (storySlider) {
      storySlider.destroy();
    }
    // storyScene.renderScene(0);
    setSlider();
  });

  document.body.addEventListener(`screenChanged`, (e) => {
    if (e.detail.screenName === `story`) {
        storyScene.initScene();

      if (storySlider.activeIndex === 0 || storySlider.activeIndex === 1) {
        storyScene.renderScene(0);
      } else if (storySlider.activeIndex === 2 || storySlider.activeIndex === 3) {
        storyScene.renderScene(1);
      } else if (storySlider.activeIndex === 4 || storySlider.activeIndex === 5) {
        storyScene.renderScene(2);
      } else if (storySlider.activeIndex === 6 || storySlider.activeIndex === 7) {
        storyScene.renderScene(3);
      }
    }
  });

  setSlider();
};
