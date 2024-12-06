import SortableTableV1 from '../../05-dom-document-loading/2-sortable-table-v1/index.js';

export default class SortableTable extends SortableTableV1 {
  constructor(headersConfig, {
    data = [],
    sorted = { id: '', order: 'asc' }
  } = {}) {
    super(headersConfig, data);
    this.sorted = sorted;
    this.currentSortField = sorted.id;
    this.currentSortOrder = sorted.order || 'asc';
    this.isSortLocally = true;
    this.arrowElement = this.createArrowElement();
    this.createListeners();
  }

  handleHeaderCellClick = (el) => {
    const cellElement = el.target.closest('.sortable-table__cell');

    if (!cellElement || cellElement.dataset.sortable === 'false') {
      return;
    }

    const sortField = cellElement.dataset.id;
    const sortOrder = (this.currentSortField === sortField && this.currentSortOrder === 'desc') ? 'asc' : 'desc';
    this.currentSortField = sortField;
    this.currentSortOrder = sortOrder;

    this.sort(sortField, sortOrder);
    cellElement.appendChild(this.arrowElement);
  }

  sort (sortField, sortOrder) {
    if (this.isSortLocally) {
      this.sortOnClient(sortField, sortOrder);
    } else {
      this.sortOnServer();
    }
  }   

  sortOnClient(sortField, sortOrder) {
    super.sort(sortField, sortOrder);
    this.updateBody();
  }

  updateBody() {
    const body = this.subElements.body;
    body.innerHTML = this.createBodyTemplate();  
  }

  createArrowElement() {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = this.createArrowTemplate();
    return tempElement.firstElementChild;
  }

  createArrowTemplate() {
    return (
      `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
      </span>`
    );
  }  

  createListeners() {
    this.subElements.header.addEventListener('pointerdown', this.handleHeaderCellClick);
  }

  destroyListeners() {
    this.subElements.header.removeEventListener('pointerdown', this.handleHeaderCellClick);
  }

  destroy() {
    super.destroy();
    this.destroyListeners();
  }


}
