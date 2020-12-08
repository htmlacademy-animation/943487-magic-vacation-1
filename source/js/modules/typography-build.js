export default class AccentTypographyBuild {
  constructor(elementSelector, timer, classForActivate, property) {
    this._TIME_SPACE = 100;

    this._elementSelector = elementSelector;
    this._timer = timer;
    this._classForActivate = classForActivate;
    this._property = property;
    this._element = document.querySelector(this._elementSelector);
    this._timeOffset = 0;

    this._element.classList.add('accent-text');

    this.prePareText();
  }

  createElement(letter, wordIndex, index) {
    var orderItem;
    function orderOfPriority(number) {
      let remainder = (number + 1) / 4;
      if ((remainder ^ 0) === remainder) {
        return (orderItem = 0);
      } else if (!(number % 2)) {
        return (orderItem = 1);
      } else {
        return (orderItem = 2);
      }
    }

    orderOfPriority(index);
    const span = document.createElement(`span`);
    span.textContent = letter;
    span.style.transition = `${this._property} ${this._timer * 2 + (wordIndex * 200)}ms ease ${
      (this._timeOffset + orderItem * 150) + (wordIndex * 200)
    }ms`;
    return span;
  }

  prePareText() {
    if (!this._element) {
      return;
    }
    const text = this._element.textContent
      .trim()
      .split(` `)
      .filter((latter) => latter !== "");

    const content = text.reduce((fragmentParent, word, index) => {
      var wordIndex = index;
      const wordElement = Array.from(word).reduce((fragment, latter, index) => {
        fragment.appendChild(this.createElement(latter, wordIndex, index));
        return fragment;
      }, document.createDocumentFragment());
      const wordContainer = document.createElement(`span`);
      wordContainer.classList.add(`accent-text__word`);
      wordContainer.appendChild(wordElement);
      fragmentParent.appendChild(wordContainer);
      return fragmentParent;
    }, document.createDocumentFragment());

    this._element.innerHTML = ``;
    this._element.appendChild(content);
  }

  runAnimation() {
    if (!this._element) {
      return;
    }
    this._element.classList.add(this._classForActivate);
  }

  destroyAnimation() {
    this._element.classList.remove(this._classForActivate);
  }
}
