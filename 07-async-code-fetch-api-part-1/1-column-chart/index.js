import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  constructor(
    {
      label = '',
      link = '',
      value = 0
    } = {}
  ) {
    this.label = label;
    this.link = link;
    this.value = value;
    this.chartHeight = 50;
    this.subElements = {}; 
    this.element = this.createElement(this.createTemplate());
    this.selectSubElements();

    this.data = {}; 
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createTemplate() {
    return (
      `<div class="${this.createChartClasses()}" style="--chart-height: 50">
        <div class="column-chart__title">
          ${this.label}
          <a href="${this.link}" class="column-chart__link">View all</a>
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">${this.value}</div>
          <div data-element="body" class="column-chart__chart">
          </div>
        </div>
      </div>`
    );
  }

  createChartClasses () {
    return (JSON.stringify(this.data) !== '{}') ? 'column-chart_loading' : 'column-chart' ;
  }

  createChartBodyTemplate() {
    return this.getColumnProps().map(({ value, percent }) => (
      `<div style="--value: ${value}" data-tooltip="${percent}"></div>`
    )).join('');
  }

  getColumnProps() {
    const maxValue = Math.max(...Object.values(this.data)); 
    const scale = this.chartHeight / maxValue; 

    return Object.entries(this.data).map(([date, value]) => {
      return {
        percent: (value / maxValue * 100).toFixed(0) + '%', 
        value: String(Math.floor(value * scale)) 
      };
    });
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(el => {
      this.subElements[el.dataset.element] = el;
    });
  }

  async update(from, to) {
    try {
      const data = await fetchJson(BACKEND_URL);
      this.data = data; 
      this.renderChart(); 
      return data;
    } catch (error) {
      console.error('Error loading data:', error);
      return [];
    }
  }

  renderChart() {
    const chartContainer = this.subElements.body;
    chartContainer.innerHTML = this.createChartBodyTemplate(); 
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
