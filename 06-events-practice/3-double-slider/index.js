export default class DoubleSlider {
  constructor({
    min = 0,
    max = 100,
    formatValue = (value) => value,
    selected = { from: 0, to: 0 },
  } = {}) {
    this.formatValue = formatValue;
    this.min = min;
    this.max = max;
    this.selected = selected;
    this.element = this.createElement(this.createTemplate());
  
    this.addEventListeners();
  }
  
  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }
  
  createTemplate() {
    return `
        <div class="range-slider">
          <span data-element="from">${this.selected.from ? this.formatValue(this.selected.from) : this.formatValue(this.min)}</span>
          <div class="range-slider__inner">
            <span class="range-slider__progress"></span>
            <span class="range-slider__thumb-left" style="left: ${(this.selected.from - this.min) / (this.max - this.min) * 100}%"></span>
            <span class="range-slider__thumb-right" style="left: ${(this.selected.to - this.min) / (this.max - this.min) * 100}%"></span>
          </div>
          <span data-element="to">${this.selected.to ? this.formatValue(this.selected.to) : this.formatValue(this.max)}</span>
        </div>
      `;
  }
  
  addEventListeners() {
    this.element.querySelector('.range-slider__thumb-left')
        .addEventListener('pointerdown', (e) => this.sliderPointerdown(e, 'left'));
    this.element.querySelector('.range-slider__thumb-right')
        .addEventListener('pointerdown', (e) => this.sliderPointerdown(e, 'right'));
  }
  
  sliderPointerdown(e, side) {
    e.preventDefault();
    this.draggingSide = side;

    this.startX = e.clientX;
    this.startLeft = parseFloat(this.element.querySelector(`.range-slider__thumb-${side}`).style.left);
  
    document.addEventListener('pointermove', this.sliderPointermove);
    document.addEventListener('pointerup', this.sliderPointerup);
  }
  
    sliderPointermove = (e) => {
      if (!this.draggingSide) {return;}
  
      const deltaX = e.clientX - this.startX;
  
      const newLeft = this.startLeft + (deltaX / this.element.offsetWidth) * 100;
      const newPercentage = Math.max(0, Math.min(100, newLeft));
  
      if (this.draggingSide === 'left') {
        this.updateLeftSlider(newPercentage);
      } else if (this.draggingSide === 'right') {
        this.updateRightSlider(newPercentage);
      }
    };
  
    sliderPointerup = () => {
      document.removeEventListener('pointermove', this.sliderPointermove);
      document.removeEventListener('pointerup', this.sliderPointerup);
      this.draggingSide = null;
  
      this.element.dispatchEvent(new CustomEvent('range-select', {
        detail: { from: this.selected.from, to: this.selected.to }
      }));
    };
  
    updateLeftSlider(newPercentage) {
      const leftSlider = this.element.querySelector('.range-slider__thumb-left');
      const rightSlider = this.element.querySelector('.range-slider__thumb-right');
      const rightPercentage = parseFloat(rightSlider.style.left);

      if (newPercentage < rightPercentage) {
        leftSlider.style.left = `${newPercentage}%`;
        this.selected.from = this.min + (newPercentage / 100) * (this.max - this.min);
        this.element.querySelector('[data-element="from"]').textContent = this.formatValue(this.selected.from);
      }
    }
  
    updateRightSlider(newPercentage) {
      const rightSlider = this.element.querySelector('.range-slider__thumb-right');
      const leftSlider = this.element.querySelector('.range-slider__thumb-left');
      const leftPercentage = parseFloat(leftSlider.style.left);
  
      if (newPercentage > leftPercentage) {
        rightSlider.style.left = `${newPercentage}%`;
        this.selected.to = this.min + (newPercentage / 100) * (this.max - this.min);
        this.element.querySelector('[data-element="to"]').textContent = this.formatValue(this.selected.to);
      }
    }
  
    removeEventListeners() {
      document.removeEventListener('pointerdown', this.sliderPointerdown);
      document.removeEventListener('pointermove', this.sliderPointermove);
    }
  
    remove() {
      this.element.remove();
    }
  
    destroy() {
      this.remove();
      this.removeEventListeners();
    }
}
  