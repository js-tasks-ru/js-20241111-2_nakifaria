class Tooltip {
  static instance = null;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance; 
    }

    Tooltip.instance = this;

    this.element = this.createElement(this.createTemplate());
    this.addEventListeners();
  }

  createTemplate() {
    return `<div class="tooltip"></div>`;
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  initialize() {
    if (!document.body.contains(this.element)) {
      document.body.appendChild(this.element);
    }
  }

  addEventListeners() {
    document.body.addEventListener('pointerover', (e) => this.handleDocumentPointerover(e));
    document.body.addEventListener('pointermove', (e) => this.handleDocumentPointermove(e));
    document.body.addEventListener('pointerout', (e) => this.handleDocumentPointerout(e));
  }

  handleDocumentPointerover(e) {
    if (!e.target.hasAttribute('data-tooltip')) {
      return;
    }

    const tooltipText = e.target.getAttribute('data-tooltip');
    this.element.textContent = tooltipText;
    this.initialize();
  }

  handleDocumentPointermove(e) {
    if (this.element.isConnected) {
      this.element.style.left = e.clientX + 10 + 'px';
      this.element.style.top = e.clientY + 10 + 'px';
    }
  }

  handleDocumentPointerout(e) {
    if (e.target.hasAttribute('data-tooltip')) {
      this.remove();
    }
  }

  removeEventListeners() {
    document.body.removeEventListener('pointerover', this.handleDocumentPointerover);
    document.body.removeEventListener('pointermove', this.handleDocumentPointermove);
    document.body.removeEventListener('pointerout', this.handleDocumentPointerout);
  }

  render(content) {
    if (this.element) {
      this.element.textContent = content; 
    }
  }

  remove () {
    if (this.element && this.element.isConnected) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.removeEventListeners();
  }
}

export default Tooltip;
