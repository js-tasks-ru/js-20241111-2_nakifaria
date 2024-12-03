export default class NotificationMessage {
    static lastShownComponent;

    constructor (text, {duration = 0, type = ""} = {}) {
      this.text = text;
      this.duration = duration;
      this.type = type;
      this.element = this.createElement(this.createTemplate());
    }

    createElement(template) {
      const element = document.createElement('div');
      element.innerHTML = template;
      return element.firstElementChild;
    }

    createTemplate() {
      return (`
    <div class="notification ${this.type}" style="--value:20s">
    <div class="timer"></div>
    <div class="inner-wrapper">
      <div class="notification-header">${this.type}</div>
      <div class="notification-body">
        ${this.text}
      </div>
    </div>
    </div>
            `);
    }

    show(targetElement = document.body) {
      if (NotificationMessage.lastShownComponent) {
        NotificationMessage.lastShownComponent.destroy();
      }
      NotificationMessage.lastShownComponent = this;
      targetElement.appendChild(this.element);
      
      
      setTimeout(() => {
        this.destroy(); 
      }, this.duration);
    }

    remove () {
      this.element.remove();
    }

    destroy() {
      this.remove();
      this.duration = 0;
    }
}
