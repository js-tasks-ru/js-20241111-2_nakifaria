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
    const config = this.headerConfig.find(item => item.id === field);

    if (config) {

      this.sortElementByStyle(field, sortStyle, config.sortType);
    }
    this.subElements.body.innerHTML = this.createBodyTemplate();
  }

  sortElementByStyle(field, sortOrder, sortType) {
    const k = sortOrder === 'asc' ? 1 : -1;
  
    if (sortType === 'string') {
      this.data.sort((a, b) => k * a[field].localeCompare(b[field], 'ru', { caseFirst: 'upper', sensitivity: 'base' }));
    }
  
    if (sortType === 'number') {
      this.data.sort((a, b) => k * (Number(a[field]) - Number(b[field])));
    }
  }

  createHeaderTemplate() {
    return this.headerConfig.map(el => (
      ` <div class="sortable-table__cell" data-id="${el.id}" data-sortable="${el.sortable}">
        <span>${el.title}</span>
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
        </div>`
    )).join(' ');
  }

  createBodyCellElement(product, headerConfig) {
    const fieldId = headerConfig['id'];
    return `<div class="sortable-table__cell">${product[fieldId]}</div>`;
  }

  createBodyRowElement(product) {
    return `
        <a href="/products/3d-ochki-optoma-zf2300" class="sortable-table__row">
          ${this.headerConfig.map(headerConfig =>
    this.createBodyCellElement(product, headerConfig)
  ).join('')}
        </a>`;
  }

  createBodyTemplate() {
    return this.data.map(product => (
      this.createBodyRowElement(product)
    )).join('');
  }

  createTemplate () {
    return (`
      <div class="sortable-table">

    <div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.createHeaderTemplate()}
    </div>

    <div data-element="body" class="sortable-table__body">
      ${this.createBodyTemplate()}
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

