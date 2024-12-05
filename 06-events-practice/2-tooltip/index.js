class Tooltip {
  static instance = null;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance; 
    }

    Tooltip.instance = this;

    this.element = null; 
    this.targetElement = null; 
  }

  initialize() {
    const container = document.createElement('div');
    container.innerHTML = `<div id="container" data-tooltip="bar-bar-bar">
      Aperiam consectetur dignissimos dolores ex mollitia.
    </div>`;

    this.targetElement = container.firstElementChild; 
    this.element = document.createElement('div'); 

    document.body.append(container); 
    document.body.append(this.element); 

    this.addEventListeners();
  }

  addEventListeners() {
    this.targetElement.addEventListener('pointerover', this.showTooltip.bind(this));
    this.targetElement.addEventListener('pointerout', this.hideTooltip.bind(this));
  }


  showTooltip() {
    const tooltipText = this.targetElement.getAttribute('data-tooltip');
    this.element.textContent = tooltipText; 
    this.element.style.visibility = 'visible'; 
  }

  hideTooltip() {
    this.element.style.visibility = 'hidden'; 
  }

  render(content) {
    if (this.element) {
      this.element.textContent = content; 

    }
  }

  destroy() {
    if (this.element) {
      this.element.remove(); 
    }

    if (this.targetElement) {
      this.targetElement.removeEventListener('pointerover', this.showTooltip);
      this.targetElement.removeEventListener('pointerout', this.hideTooltip);
      this.targetElement = null;
    }
  }
}

export default Tooltip;
