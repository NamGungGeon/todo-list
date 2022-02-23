import './style.css';

import { createDividerElement } from './components/divider';
import { createFooterElement } from './components/footer';
import { createHeaderElement } from './components/header';
import { createTodoElement } from './components/todo';
import { Todo } from './models/Todo';
import TodoListState, { TodoListStateType } from './state/TodoListState';
import { createTrashHoleElement } from './components/trashhole';
import { createTodoViewOptionElement } from './components/viewOptions';

const todoListState = new TodoListState();

const app = document.querySelector<HTMLDivElement>('#app')!;

const renderUI = (state: TodoListStateType) => {
  const { todoList, listingStyle } = state;

  console.log('renderUI', todoList);

  //reset
  app.innerHTML = '';

  //header
  app.appendChild(createHeaderElement(todoListState.getRestTodoCnt()));

  //divider
  app.appendChild(createDividerElement());

  //body
  //body:: view option
  const handleRemove = (targetTodoId: number) => {
    const fIndex = todoList.findIndex((todo: Todo) => {
      return todo.id === targetTodoId;
    });
    if (fIndex !== -1) {
      todoListState.remove(todoList[fIndex]);
    }
  };
  app.appendChild(createTrashHoleElement(handleRemove));
  const todoViewOptionsElement = createTodoViewOptionElement(
    listingStyle,
    (listingStyle) => todoListState.setListingStyle(listingStyle)
  );
  app.appendChild(todoViewOptionsElement);

  //body:: todolist
  const todolistElement = document.createElement('div');
  todolistElement.classList.add('todolist');
  todolistElement.classList.add(listingStyle);

  app.appendChild(todolistElement);
  const handleSwap = (todo: Todo, droppedTodoId: number) => {
    console.log('handleSwap');
    const currentTodoId = todo.id;

    const targetIndexes: [number, number] = [
      todoList.findIndex((todo) => todo.id === currentTodoId),
      todoList.findIndex((todo) => todo.id === droppedTodoId),
    ];
    if (targetIndexes[0] !== -1 && targetIndexes[1] !== -1) {
      todoListState.swapOrder(...targetIndexes);
    }
  };
  todoList
    .sort((t1, t2) => t1.orderId - t2.orderId)
    .map((todo: Todo) => {
      const todoElement: HTMLDivElement = createTodoElement(
        todo,
        (todo) => todoListState.update(todo),
        handleSwap,
        (todo) => todoListState.remove(todo)
      );
      todolistElement.appendChild(todoElement);
    });
  if (todoList.length === 0) todolistElement.remove();

  //divider
  app.appendChild(createDividerElement());

  //footer
  app.appendChild(createFooterElement((title) => todoListState.addTodo(title)));
};

todoListState.addObserver((state: TodoListStateType) => {
  renderUI(state);
});

todoListState.load().catch((e) => {
  console.error(e);
  app.innerHTML = `
      <p>json-server가 동작하지 않는 것 같습니다</p>
      <br/>
      <pre>
        ${e.toString().trim()}
      </pre>
    `;
});
