import { createDividerElement } from "./components/divider";
import { createFooterElement } from "./components/footer";
import { createHeaderElement } from "./components/header";
import { createTodoElement } from "./components/todo";
import { Todo } from "./models/todo";
import "./style.css";
import _todoListData from "./values/todo.sm.json";

const app = document.querySelector<HTMLDivElement>("#app")!;
const todoListData = [..._todoListData].map((todoData) => {
  return Todo.createFromJson(todoData);
});

const getUseableId = () => {
  if (todoListData.length) {
    const lastTodo = todoListData[todoListData.length - 1];
    return lastTodo.id + 1;
  }

  return 1;
};

const renderUI = () => {
  console.log("renderUI", todoListData);
  //remove todo
  todoListData.every((todo: Todo, idx: number) => {
    //id===-1이면 삭제 버튼이 눌린 todo
    if (todo.id === -1) {
      todoListData.splice(idx, 1);
      return false;
    }
    return true;
  });

  //reset
  app.innerHTML = "";

  //header
  app.appendChild(createHeaderElement(todoListData.length));

  //divider
  app.appendChild(createDividerElement());

  //contents
  const contentElement = document.createElement("div");
  app.appendChild(contentElement);
  todoListData.map((todo: Todo) => {
    const todoElement: HTMLDivElement = createTodoElement(todo, (todo) => {
      console.log("update target todo", todo);
      renderUI();
    });
    contentElement.appendChild(todoElement);
  });

  //footer
  const handleSearch = (title: string) => {
    //handle keyword...
    console.log(title);
    todoListData.push(new Todo(false, getUseableId(), title, 1));

    renderUI();
  };
  app.appendChild(createFooterElement(handleSearch));
};

renderUI();
