import { AbstractComponent } from "../framework/view/abstract-component.js";

function createDragAndDropTaskComponentTemplate() {
  return `<li class="task-element drag-and-drop">Перетащите карточку</li>`;
}

export default class TaskComponent extends AbstractComponent {
  constructor() {
    super();
  }

  get template() {
    return createDragAndDropTaskComponentTemplate();
  }
}
