// modules
import mobileHeight from "./modules/mobile-height-adjust.js";
import slider from "./modules/slider.js";
import menu from "./modules/menu.js";
import footer from "./modules/footer.js";
import chat from "./modules/chat.js";
import result from "./modules/result.js";
import form from "./modules/form.js";
import social from "./modules/social.js";
import body from "./modules/body.js";
import FullPageScroll from "./modules/full-page-scroll";
import AccentTypographyBuild from "./modules/typography-build";

// init modules
mobileHeight();
slider();
menu();
footer();
chat();
result();
form();
social();
body();

const fullPageScroll = new FullPageScroll();
fullPageScroll.init();

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

const animationIntroDate = new AccentTypographyBuild(
  `.intro__date`,
  200,
  `active`,
  `transform`
);
setTimeout(() => {
  animationIntroDate.runAnimation();
}, 1200);
