import Swiper from "swiper";

export default ({scene}) => {
  let storySlider;

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
                scene.renderScene(1);
            } else if (storySlider.activeIndex === 2 || storySlider.activeIndex === 3) {
                scene.renderScene(2);
            } else if (storySlider.activeIndex === 4 || storySlider.activeIndex === 5) {
                scene.renderScene(3);
            } else if (storySlider.activeIndex === 6 || storySlider.activeIndex === 7) {
                scene.renderScene(4);
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
                scene.renderScene(1);
            } else if (storySlider.activeIndex === 2) {
                scene.renderScene(2);
            } else if (storySlider.activeIndex === 4) {
                scene.renderScene(3);
            } else if (storySlider.activeIndex === 6) {
                scene.renderScene(4);
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
    setSlider();
  });

  document.body.addEventListener(`screenChanged`, (e) => {
    if (e.detail.screenName === `story`) {
        scene.renderScene(1);
    }
  });

  setSlider();
};
