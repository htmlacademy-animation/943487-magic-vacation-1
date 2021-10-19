import throttle from 'lodash/throttle';
import Timer from './timer.js';
import NumbersTimer from './numbersTimer.js';
import Story from './three/story-scene.js';

const historyPage = 1;
const prizesPage = 2;
const gamePage = 4;

export default class FullPageScroll {
  constructor() {
    const gameContainer = document.getElementById("timer");
    this.gameTimer = new Timer(gameContainer);

    this.numberContainerFirst = document.getElementById("animate-number-1");
    this.numberFirstTimer = new NumbersTimer({
        numberContainer: this.numberContainerFirst, 
        start: 1,
        end: 3,
        step: 1
    });

    this.numberContainerSecond = document.getElementById("animate-number-2");
    this.numberSecondTimer = new NumbersTimer({
        numberContainer: this.numberContainerSecond, 
        start: 1,
        end: 7,
        step: 1
    });

    this.numberContainerThird = document.getElementById("animate-number-3");
    this.numberThirdTimer = new NumbersTimer({
        numberContainer: this.numberContainerThird, 
        start: 11,
        end: 900,
        step: 168
    });

    this.THROTTLE_TIMEOUT = 2000;

    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);
    this.menuElements = document.querySelectorAll(`.page-header__menu .js-menu-link`);

    this.activeScreen = 0;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);

    this.setScene();
  }

  init() {
    document.addEventListener(`wheel`, throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT, {trailing: true}));
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);

    this.onUrlHashChanged();
    this.initScene();
  }

  onScroll(evt) {
    const currentPosition = this.activeScreen;
    this.reCalculateActiveScreenPosition(evt.deltaY);
    if (currentPosition !== this.activeScreen) {
      this.changePageDisplay();
    }
  }

  onUrlHashChanged() {
    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
    this.activeScreen = (newIndex < 0) ? 0 : newIndex;
    this.changePageDisplay();
  }

  changePageDisplay() {
    this.changeVisibilityDisplay();
    this.changeActiveMenuItem();
    this.emitChangeDisplayEvent();
  }

  changeVisibilityDisplay() {
    let body = document.querySelector("body");
    let prizeFirstSrc = "img/prize1.svg";
    let prizeSecondSrc = "img/prize2.svg";
    let prizeThirdSrc = "img/prize3.svg"
    let prizeFirst = document.getElementById(`prizeFirst`);
    let prizeSecond = document.getElementById(`prizeSecond`);
    let prizeThird = document.getElementById(`prizeThird`);

    this.screenElements.forEach((screen) => {
      let prevScreenActive = document.querySelector(`.screen.active`);
      const screenChangeTimout = screen.classList.contains(`screen--story`) && this.screenElements[this.activeScreen].classList.contains(`screen--prizes`);
      const animationScreenBg = prevScreenActive && prevScreenActive.classList.contains(`screen--story`) && this.screenElements[this.activeScreen].classList.contains(`screen--prizes`);
      
      if (animationScreenBg) {
        document.querySelector(`.screen-bg`).style.transitionDuration = "0.5s"; 
      } else {
        document.querySelector(`.screen-bg`).style.transitionDuration = "0s"; 
      }

      if (screenChangeTimout) {
        setTimeout(() => {
          screen.classList.add(`screen--hidden`);
          screen.classList.remove(`active`);
        }, 800);
        
      } else {
        body.classList.forEach(className => {
          if (className.startsWith('slide-')) {
            body.classList.remove(className);
          }
        });
        screen.classList.add(`screen--hidden`);
        screen.classList.remove(`active`);
      }
    });

    this.screenElements[this.activeScreen].classList.remove(`screen--hidden`);
    this.screenElements[this.activeScreen].classList.add(`active`);
    if (this.activeScreen === historyPage) body.classList.add("slide-1");
    if (this.activeScreen === prizesPage) {
        this.numberFirstTimer.startTimer();
        this.numberContainerFirst.nextElementSibling.classList.add('text-right-animate');

        prizeFirst.src = prizeFirstSrc;
        prizeSecond.src = prizeSecondSrc;
        prizeThird.src = prizeThirdSrc;

        setTimeout(() => {
          this.numberSecondTimer.startTimer();
          this.numberContainerSecond.nextElementSibling.classList.add('text-right-animate');
        }, 2700);

        setTimeout(() => {
          this.numberThirdTimer.startTimer();
          this.numberContainerThird.nextElementSibling.classList.add('text-right-animate');
        }, 5300);
    }
    if (this.activeScreen === gamePage) this.gameTimer.startTimer();
  }

  changeActiveMenuItem() {
    const activeItem = Array.from(this.menuElements).find((item) => item.dataset.href === this.screenElements[this.activeScreen].id);
    if (activeItem) {
      this.menuElements.forEach((item) => item.classList.remove(`active`));
      activeItem.classList.add(`active`);
    }
  }

  emitChangeDisplayEvent() {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        'screenId': this.activeScreen,
        'screenName': this.screenElements[this.activeScreen].id,
        'screenElement': this.screenElements[this.activeScreen]
      }
    });

    document.body.dispatchEvent(event);
  }

  reCalculateActiveScreenPosition(delta) {
    if (delta > 0) {
      this.activeScreen = Math.min(this.screenElements.length - 1, ++this.activeScreen);
    } else {
      this.activeScreen = Math.max(0, --this.activeScreen);
    }
  }
  
  setScene() {
    this.scene = new Story();
  }

  initScene() {
    const initScene = (screenName) => {
      if (screenName === `top` || screenName === `story`) {
        this.scene.initScene(screenName);
      } else {
        this.scene.end();
      }
    };

    initScene(this.screenElements[this.activeScreen].id);

    document.body.addEventListener(`screenChanged`, (event) => {
      const {detail} = event;
      const {screenName} = detail;

      initScene(screenName);
    });
  }

  getScene() {
    return this.scene;
  }
}
