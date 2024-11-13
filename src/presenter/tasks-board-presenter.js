import TaskColumnComponent from "../view/task-column-component.js";
import TaskPresenter from "./task-presenter.js";
import ClearButtonComponent from "../view/clear-button-component.js";
import LoadingComponent from "../view/loading-component.js";
import { render } from "../framework/render.js";
import { Status } from "../consts.js";

export default class TasksBoardPresenter {
  #taskBoardContainer;
  #tasksModel;

  constructor({ taskBoardContainer, tasksModel }) {
    this.#taskBoardContainer = taskBoardContainer;
    this.#tasksModel = tasksModel;
    this.#tasksModel.addObserver(this.#handleModelChange.bind(this));
  }

  #handleModelChange() {
    this.#clearBoard();
    this.init();
  }

  #clearBoard() {
    this.#taskBoardContainer.innerHTML = "";
  }

  async init() {
    const loadingComponent = new LoadingComponent();
    render(loadingComponent, this.#taskBoardContainer);
    await this.#tasksModel.init();
    loadingComponent.element.remove();

    Object.values(Status).forEach((status) => {
      var taskColumnElement = this.#renderTasksColumn(
        status,
        this.#taskBoardContainer
      );

      const tasksInCurrentStatus = this.#tasksModel.getTasksByStatus(status);

      const taskPresenter = new TaskPresenter({ tasks: tasksInCurrentStatus });
      taskPresenter.init(taskColumnElement);
    });

    this.#makeClearButton();
  }

  #renderTasksColumn(status, container) {
    const taskColumnComponent = new TaskColumnComponent({
      status,
      onTaskDrop: this.#handleTaskDrop.bind(this),
    });

    render(taskColumnComponent, container);

    return taskColumnComponent.element;
  }

  async #handleTaskDrop(taskId, newStatus, position) {
    try {
      await this.#tasksModel.updateTaskStatus(taskId, newStatus);
      // if (position) {
      //   this.#tasksModel.moveTask(taskId, position);
      // }
    } catch (err) {
      console.error("Ошибка при обновлении статуса задачи:", err);
    }
  }

  #makeClearButton() {
    const tasksInStatusTrash = this.#tasksModel.getTasksByStatus(Status.TRASH);
    const noTasks = tasksInStatusTrash.length === 0;

    const trashContainer = document.querySelector(`.${Status.TRASH}`);
    const clearButtonComponent = new ClearButtonComponent(
      noTasks,
      this.cleanTrash.bind(this)
    );

    render(clearButtonComponent, trashContainer);
  }

  async createTask() {
    const taskTitle = document.querySelector("#add-task").value.trim();

    if (!taskTitle) {
      return;
    }

    try {
      await this.#tasksModel.addTask(taskTitle);
      document.querySelector("#add-task").value = "";
    } catch {
      console.error("Ошибка при добавлении задачи:", err);
    }
  }

  async cleanTrash() {
    const tasksInStatusTrash = this.#tasksModel.getTasksByStatus(Status.TRASH);
    try {
      await this.#tasksModel.deleteTasks(tasksInStatusTrash);
    } catch {
      console.error("Ошибка при удалении задач:", err);
    }
  }
}
