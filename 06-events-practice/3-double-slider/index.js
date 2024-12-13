export default class DoubleSlider {
    subElements = {}

    constructor({
      min = 100,
      max = 200,
      formatValue = value => value,
      selected = {},
    } = {}) {
      
      this.min = min;
      this.max = max;
      this.formatValue = formatValue;
      this.from = selected.from || min;
      this.to = selected.to || max;

      this.element = this.createElement(this.createTemplate());
  
      this.selectSubElements();
      this.createEventListeners();
    }
  
    createElement(template) {
      const element = document.createElement('div');
      element.innerHTML = template;
      return element.firstElementChild;
    }
  
    createTemplate() {
      const LeftProgress = this.toPercent(this.from);
      const rightProgress = this.toPercent(this.to);

      return `
        <div class="range-slider">
          <span data-element="from">${this.formatValue(this.from)}</span>
          <div data-element = "container" class="range-slider__inner">
      <span data-element = "thumbProgress" class="range-slider__progress" style="left: ${LeftProgress}; right: ${rightProgress}"></span>
      <span data-element = "thumbLeft" class="range-slider__thumb-left" style="left: ${LeftProgress}"></span>
      <span data-element = "thumbRight" class="range-slider__thumb-right" style="right: ${rightProgress}"></span>
          </div>
          <span data-element="to">${this.formatValue(this.to)}</span>
        </div>
      `;
    }
  
    toPercent (rawValue) {
      const value = rawValue - this.min;
      const total = this.max - this.min;
      return Math.round(value / total * 100);
    }

    selectSubElements() {
      this.element.querySelectorAll('[data-element]').forEach(el => {
        this.subElements[el.dataset.element] = el;
      });
    }

    createEventListeners() {
      this.subElements.thumbLeft
        .addEventListener('pointerdown', this.thumbPointerDown);
      this.subElements.thumbRight
        .addEventListener('pointerdown', this.thumbPointerDown);
    }
  
    processPointerMove = (e) => {
      const {left, width} = this.subElements.container.getBoundingClientRect();
      const containerLeftX = left;
      const containerRightX = left + width;

      const pointerX = e.clientX;
      const resultPointerX = Math.min(containerRightX, Math.max(containerLeftX, pointerX));
      const percentPointerX = Math.round((resultPointerX - containerLeftX) / (containerRightX - containerLeftX) * 100);
      return this.min + (this.max - this.min) * percentPointerX / 100;

    }

    thumbPointerMove = (e) => {

      if (e.target.dataset.element === "thumbLeft") {
        this.from = this.processPointerMove(e);
        this.subElements.from.textContent = this.formatValue(this.from);
        this.subElements.container.style = this.toPercent();
      }
      if (e.target.dataset.element === "thumbRight") {
        this.to = this.processPointerMove(e);
        this.subElements.to.textContent = this.formatValue(this.to);
        this.subElements.container.style = this.toPercent();
      }
    }

    thumbPointerDown = (e) => {
      document.addEventListener('pointermove', this.thumbPointerMove);
      document.addEventListener('pointerup', this.thumbPointerUp);
    }

    thumbPointerUp = (e) => {
      this.dispatchCustomEvent();
      document.removeEventListener('pointermove', this.thumbPointerMove);
      document.removeEventListener('pointerup', this.thumbPointerUp);
    }

    dispatchCustomEvent () {
      const event = new CustomEvent('range-select', {
        detail: {
          from: this.from,
          to: this.to
        }
      });
      this.element.dispatchEvent(event);
    }

    removeEventListeners() {
      document.removeEventListener('pointerdown', this.thumbLeftPointerDown);
      document.removeEventListener('pointermove', this.thumbRightPointerDown);
    }
  
    remove() {
      this.element.remove();
    }
  
    destroy() {
      this.remove();
      this.removeEventListeners();
    }
}
  