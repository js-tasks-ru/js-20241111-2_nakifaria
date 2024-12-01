export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.data = data;
    this.headerConfig = headerConfig;
    this.element = this.createElement(this.createTemplate());
    this.subElements = this.getSubElements(this.element);
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');
    elements.forEach(el => {
      const name = el.dataset.element;
      result[name] = el;
    });
    return result;
  }

  sort(field, sortStyle) {
    if (this.headerConfig.find(item => item.id === field)) {
      if (sortStyle === 'asc') {
        this.data.sort((a, b) => {
          if (typeof a[field] === 'string' && typeof b[field] === 'string') {
            return a[field].localeCompare(b[field], ['ru', 'en'], { caseFirst: 'upper' });
          }
          return a[field] - b[field]; 
        });
      } else if (sortStyle === 'desc') {
        this.data.sort((a, b) => {
          if (typeof a[field] === 'string' && typeof b[field] === 'string') {
            return b[field].localeCompare(a[field], ['ru', 'en'], { caseFirst: 'upper' });
          }
          return b[field] - a[field]; 
        });
      }
    }

    const body = this.subElements.body;
    body.innerHTML = this.createBody();
  }


  createHeader() {
    return this.headerConfig.map(el => (
      ` <div class="sortable-table__cell" data-id="${el.id}" data-sortable="${el.sortable}">
        <span>${el.title}</span>
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
        </div>`
    )).join(' ');
  }

  createBodyCell(product, headerConfig) {
    const fieldId = headerConfig['id'];
    return `<div class="sortable-table__cell">${product[fieldId]}</div>`;
  }

  createBodyRow(product) {
    return `
        <a href="/products/3d-ochki-optoma-zf2300" class="sortable-table__row">
          ${this.headerConfig.map(headerConfig =>
    this.createBodyCell(product, headerConfig)
  ).join('')}
        </a>`;
  }

  createBody() {
    return this.data.map(product => (
      this.createBodyRow(product)
    )).join('');
  }

  createTemplate () {
    return (`
      <div class="sortable-table">

    <div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.createHeader()}
    </div>

    <div data-element="body" class="sortable-table__body">
      ${this.createBody()}
    </div>

    <div data-element="loading" class="loading-line sortable-table__loading-line"></div>

    <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
      <div>
        <p>No products satisfies your filter criteria</p>
        <button type="button" class="button-primary-outline">Reset all filters</button>
      </div>
    </div>

  </div>
    `);}

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}

