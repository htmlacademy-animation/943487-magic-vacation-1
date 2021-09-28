import AccentTypographyBuild from './typography-build';
import Intro from './three/intro.js';

const animationTitle = () => {
  const animationIntroTitle = new AccentTypographyBuild(
    `.intro__title`,
    300,
    `active`,
    `transform`
  );
  setTimeout(() => {
    animationIntroTitle.runAnimation();
  }, 500);

  const animationSliderTitle = new AccentTypographyBuild(
    `.slider__item-title`,
    300,
    `active`,
    `transform`
  );
  animationSliderTitle.runAnimation();

  const animationPrizesTitle = new AccentTypographyBuild(
    `.prizes__title`,
    300,
    `active`,
    `transform`
  );
  animationPrizesTitle.runAnimation();

  const animationRulesTitle = new AccentTypographyBuild(
    `.rules__title`,
    300,
    `active`,
    `transform`
  );
  animationRulesTitle.runAnimation();

  const animationGameTitle = new AccentTypographyBuild(
    `.game__title`,
    300,
    `active`,
    `transform`
  );
  setTimeout(() => {
    animationGameTitle.runAnimation();
  }, 300);
};

const animationDate = () => {
  const animationIntroDate = new AccentTypographyBuild(
    `.intro__date`,
    200,
    `active`,
    `transform`
  );
  setTimeout(() => {
    animationIntroDate.runAnimation();
  }, 1200);
};

const animationCanvas = () => {
  const scene = new Intro();

  document.body.addEventListener(`screenChanged`, (event) => {
    const { detail } = event;
    const { screenName } = detail;

    if (screenName === `top`) {
      scene.initScene();
    } else {
      scene.end();
    }
  });
};

export default () => {
  animationTitle();
  animationDate();
  animationCanvas();
};
