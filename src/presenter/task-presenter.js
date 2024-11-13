import DragAndDropTaskComponent from "../view/drag-and-drop-task-component.js";
import TaskComponent from "../view/task-component.js";
import { render } from "../framework/render.js";

export default class TaskPresenter {
  #tasks;

  constructor({ tasks }) {
    this.#tasks = tasks;
  }

  init(taskColumnElement) {
    if (this.#tasks.length === 0) {
      render(new DragAndDropTaskComponent(), taskColumnElement);
    } else {
      Object.values(this.#tasks).forEach((task) => {
        this.#renderTask(task, taskColumnElement);
      });
    }
  }

  #renderTask(task, container) {
    const taskComponent = new TaskComponent({ task });

    render(taskComponent, container);
  }
}
