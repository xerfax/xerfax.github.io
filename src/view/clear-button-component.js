import { AbstractComponent } from "../framework/view/abstract-component.js";

function createClearButtonComponentTemplate() {
  return `<button class="clear-button">× Очистить</button>`;
}

export default class ClearButtonComponent extends AbstractComponent {
  #handleClick = null;

  constructor(isDisabled, onClick) {
    super();
    this.element.disabled = isDisabled;
    this.#handleClick = onClick;
    this.element.addEventListener("click", this.#clickHandler);
  }

  get template() {
    return createClearButtonComponentTemplate();
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };
}
