import { AbstractComponent } from "../framework/view/abstract-component.js";

function createLoadingComponentTemplate() {
  return `<span class="loader"></span>`;
}

export default class LoadingComponent extends AbstractComponent {
  get template() {
    return createLoadingComponentTemplate();
  }
}
