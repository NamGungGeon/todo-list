import { Todo } from "../models/todo";

let updateTargetTodoId = -1;

export const createTodoElement = (
  todo: Todo,
  handleUpdate: (todo: Todo) => void
): HTMLDivElement => {
  const containerElement: HTMLDivElement = document.createElement("div");
  containerElement.setAttribute("class", `todo ${todo.completed? 'completed': ''}`);
  containerElement.setAttribute("id", `todo-${todo.id}`);
  containerElement.innerHTML = `
    <div class='content'>
      <span class='checkbox'></span>
      ${
        todo.id === updateTargetTodoId
          ? `<input type='text' value='${todo.title}' class='nextTitle' placeholder='변경할 이름을 입력하세요'/>`
          : `<h3 class="title">${todo.title}</h3>`
      }
    </div>
    <div class='options'>
      <button class='updateBtn'>변경</button>
      <button class='deleteBtn'>삭제</button>
    </div>
  `;

  containerElement.querySelector(".content")!.addEventListener("click", () => {
    todo.completed = !todo.completed;
    handleUpdate(todo);
  });
  const nextTitleInputElement: HTMLInputElement | null =
    containerElement.querySelector(".nextTitle");
  nextTitleInputElement?.addEventListener("click", (e: Event) => {
    e.stopPropagation();
  });
  nextTitleInputElement?.addEventListener("change", () => {
    updateTargetTodoId = -1;

    //not allow empty string
    if (nextTitleInputElement?.value) todo.title = nextTitleInputElement.value;
    handleUpdate(todo);
  });

  containerElement
    .querySelector(".deleteBtn")!
    .addEventListener("click", () => {
      //remove...
      todo.id = -1;
      handleUpdate(todo);
    });
  containerElement
    .querySelector(".updateBtn")!
    .addEventListener("click", () => {
      if (todo.id !== updateTargetTodoId) {
        updateTargetTodoId = todo.id;
      } else {
        updateTargetTodoId = -1;
      }
      handleUpdate(todo);
    });
  return containerElement;
};
