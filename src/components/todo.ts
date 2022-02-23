import { Todo } from '../models/todo';

let updateTargetTodoId = -1;

export const createTodoElement = (
  todo: Todo,
  handleUpdate: (todo: Todo) => void,
  handleSwap: (todo: Todo, droppedTodoId: number) => void
): HTMLDivElement => {
  const containerElement: HTMLDivElement = document.createElement('div');
  containerElement.setAttribute(
    'class',
    `todo ${todo.completed ? 'completed' : ''}`
  );
  containerElement.setAttribute('draggable', `true`);
  containerElement.setAttribute('id', `todo-${todo.id}`);
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
  containerElement.addEventListener('dragstart', (e: DragEvent) => {
    e.dataTransfer?.setData('todoId', todo.id.toString());
    containerElement.classList.add('viberate');
  });
  containerElement.addEventListener('dragend', (e: DragEvent) => {
    containerElement.classList.remove('viberate');
  });

  containerElement.addEventListener('drop', (e: DragEvent) => {
    e.preventDefault();
    const targetTodoId: number = Number(e.dataTransfer?.getData('todoId') || 0);
    if (targetTodoId > 0) {
      //valid
      handleSwap(todo, targetTodoId);
    }
  });
  containerElement.addEventListener('dragover', (e: Event) => {
    e.preventDefault();

    containerElement.classList.add('swap');
  });
  containerElement.addEventListener('dragleave', (e: Event) => {
    e.preventDefault();
    containerElement.classList.remove('swap');
  });

  containerElement.querySelector('.content')!.addEventListener('click', () => {
    todo.completed = !todo.completed;
    handleUpdate(todo);
  });
  const nextTitleInputElement: HTMLInputElement | null =
    containerElement.querySelector('.nextTitle');
  nextTitleInputElement?.addEventListener('click', (e: Event) => {
    e.stopPropagation();
  });
  nextTitleInputElement?.addEventListener('change', () => {
    updateTargetTodoId = -1;

    //not allow empty string
    if (nextTitleInputElement?.value) todo.title = nextTitleInputElement.value;
    handleUpdate(todo);
  });

  containerElement
    .querySelector('.deleteBtn')!
    .addEventListener('click', () => {
      //remove...
      todo.id = -1;
      handleUpdate(todo);
    });
  containerElement
    .querySelector('.updateBtn')!
    .addEventListener('click', () => {
      if (todo.id !== updateTargetTodoId) {
        updateTargetTodoId = todo.id;
      } else {
        updateTargetTodoId = -1;
      }
      handleUpdate(todo);
    });
  return containerElement;
};
