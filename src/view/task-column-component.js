import { AbstractComponent } from "../framework/view/abstract-component.js";
import { StatusLabel } from "../consts.js";

function createTaskColumnComponentTemplate(status) {
  return `<div class="task-column ${status}">
            <h3>${StatusLabel[status]}</h3>
            <ul class="task-list">
            </ul>
          </div>`;
}

export default class TaskColumnComponent extends AbstractComponent {
  status;

  constructor({ status, onTaskDrop }) {
    super();
    this.status = status;
    this.#setDropHandler(onTaskDrop);
  }

  get template() {
    return createTaskColumnComponentTemplate(this.status);
  }

  #setDropHandler(onTaskDrop) {
    const container = this.element;
    let draggedOverTask = null;

    container.addEventListener("dragover", (event) => {
      event.preventDefault();

      draggedOverTask = event.target.closest(".task-element");
    });

    container.addEventListener("drop", (event) => {
      event.preventDefault();

      const taskId = event.dataTransfer.getData("text/plain");
      const position = draggedOverTask ? draggedOverTask.dataset.taskId : null;

      onTaskDrop(taskId, this.status, position);
    });
  }
}
