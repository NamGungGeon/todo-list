import { createDividerElement } from './components/divider';
import { createFooterElement } from './components/footer';
import { createHeaderElement } from './components/header';
import { createTodoElement } from './components/todo';
import { Todo } from './models/todo';
import './style.css';
import _todoListData from './values/todo.sm.json';
import State from './utils/state';

const app = document.querySelector<HTMLDivElement>('#app')!;

const todoListState = new State<Todo[]>([]);

const getUsableTodoId = (todoListData: Todo[]) => {
  if (todoListData.length) {
    const lastTodo = todoListData[todoListData.length - 1];
    return lastTodo.id + 1;
  }

  return 1;
};

const renderUI = (todoListData: Todo[]) => {
  console.log('renderUI', todoListData);
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
  app.innerHTML = '';

  //header
  const restTodoCnt = todoListData.reduce<number>(
    (acc: number, todo: Todo): number => {
      if (!todo.completed) {
        return acc + 1;
      }
      return acc;
    },
    0
  );
  app.appendChild(createHeaderElement(restTodoCnt));

  //divider
  app.appendChild(createDividerElement());

  //contents
  const contentElement = document.createElement('div');
  app.appendChild(contentElement);
  todoListData.map((todo: Todo) => {
    const todoElement: HTMLDivElement = createTodoElement(todo, (todo) => {
      console.log('update target todo', todo);
      todoListState.setState([...todoListData]);
    });
    contentElement.appendChild(todoElement);
  });

  //footer
  const handleSearch = (title: string) => {
    //handle keyword...
    console.log(title);

    todoListState.setState([
      ...todoListData,
      new Todo(false, getUsableTodoId(todoListData), title, 1),
    ]);
  };
  app.appendChild(createFooterElement(handleSearch));
};

let savedTodoListData: any = localStorage.getItem('todoList');
if (savedTodoListData) {
  try {
    savedTodoListData = JSON.parse(savedTodoListData);
  } catch (e) {
    console.error('savedTodoListData', 'JSON parse error', e);
  }
}
const sourceTodoListData = savedTodoListData || [..._todoListData];
const todoListData: Todo[] = sourceTodoListData
  .map((todoData: any): Todo | null => {
    try {
      return Todo.createFromJson(todoData);
    } catch (e) {
      console.error('createFromJSON', e);
      return null;
    }
  })
  .filter((todo: Todo) => todo !== null);

todoListState.addObserver((todoList: Todo[]) => {
  renderUI(todoList);

  localStorage.setItem('todoList', JSON.stringify(todoList));
});
todoListState.setState(todoListData);
