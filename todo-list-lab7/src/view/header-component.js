import { AbstractComponent } from "../framework/view/abstract-component.js";

function createHeaderComponentTemplate() {
  return `<header class="header">
            <div>
              <h1>Список задач</h1>
            </div>
          </header>`;
}

export default class HeaderComponent extends AbstractComponent {
  constructor() {
    super();
  }

  get template() {
    return createHeaderComponentTemplate();
  }
}
