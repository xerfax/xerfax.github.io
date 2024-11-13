import HeaderComponent from "./view/header-component.js";
import FormAddTaskComponent from "./view/form-add-task-component.js";
import TasksBoardPresenter from "./presenter/tasks-board-presenter.js";
import { render, RenderPosition } from "../src/framework/render.js";
import TasksModel from "./model/task-model.js";
import TasksApiService from "./tasks-api-service.js";

const END_POINT = "https://673418cfa042ab85d118df9b.mockapi.io/";
const bodyContainer = document.querySelector("body");
const formContainer = document.querySelector(".task-form");
const taskBoardContainer = document.querySelector(".task-board");

const tasksApiService = new TasksApiService(END_POINT);
const tasksModel = new TasksModel({
  tasksApiService,
});
const headerComponent = new HeaderComponent();
const tasksBoardPresenter = new TasksBoardPresenter({
  taskBoardContainer,
  tasksModel,
});
const formAddTaskComponent = new FormAddTaskComponent({
  onClick: handleNewTaskButtonClick,
});

render(headerComponent, bodyContainer, RenderPosition.AFTERBEGIN);
render(formAddTaskComponent, formContainer);

tasksBoardPresenter.init();

function handleNewTaskButtonClick() {
  tasksBoardPresenter.createTask();
}
