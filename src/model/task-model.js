import generateId from "../utils.js";
import Observable from "../framework/observable.js";
import { UpdateType } from "../consts.js";
import { UserAction } from "../consts.js";

export default class TasksModel extends Observable {
  #tasksApiService = null;
  #boardTasks;

  constructor({ tasksApiService }) {
    super();
    this.#tasksApiService = tasksApiService;
  }

  async init() {
    try {
      const tasks = await this.#tasksApiService.tasks;
      this.#boardTasks = tasks;
    } catch (err) {
      this.#boardTasks = [];
    }
  }

  get tasks() {
    return this.#boardTasks;
  }

  getTasksByStatus(status) {
    return this.#boardTasks.filter((task) => task.status === status);
  }

  async addTask(title) {
    const newTask = {
      id: generateId().toString(),
      title,
      status: "backlog",
    };

    try {
      const createdTask = await this.#tasksApiService.addTask(newTask);
      this.#boardTasks.push(createdTask);
      this._notify(UserAction.ADD_TASK, createdTask);
    } catch (err) {
      console.error("Ошибка при добавлении задачи на сервер:", err);
      throw err;
    }
  }

  async deleteTasks(tasks) {
    for (const task of tasks) {
      await this.#deleteTask(task);
    }
    this._notify(UserAction.DELETE_TASK, tasks);
  }

  async #deleteTask(task) {
    try {
      await this.#tasksApiService.deleteTask(task.id);
    } catch (err) {
      console.error("Ошибка при удалении задачи на сервере:", err);
      throw err;
    }
  }

  async updateTaskStatus(taskId, newStatus) {
    const task = this.#boardTasks.find((task) => task.id === taskId);
    if (task) {
      const previousStatus = task.status;
      task.status = newStatus;
      try {
        const updatedTask = await this.#tasksApiService.updateTask(task);
        Object.assign(task, updatedTask);
        this._notify(UserAction.UPDATE_TASK, task);
      } catch (err) {
        console.error("Ошибка при обновлении статуса задачи", err);
        task.status = previousStatus;
        throw err;
      }
    }
  }

  moveTask(taskId, targetTaskId) {
    const taskIndex = this.tasks.findIndex((task) => task.id === taskId);
    const targetIndex = this.tasks.findIndex(
      (task) => task.id === targetTaskId
    );

    const [movedTask] = this.tasks.splice(taskIndex, 1);

    this.tasks.splice(targetIndex, 0, movedTask);

    this._notify("moveTask", taskId);
  }
}
