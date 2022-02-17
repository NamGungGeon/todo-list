import { createDividerElement } from './components/divider';
import { createFooterElement } from './components/footer';
import { createHeaderElement } from './components/header';
import { createTodoElement } from './components/todo';
import { Todo } from './models/todo';
import './style.css';
import _todoListData from './values/todo.sm.json';
import State from './utils/state';

const app = document.querySelector<HTMLDivElement>('#app')!;

const getUseableId = () => {
  if (todoListData.length) {
    const lastTodo = todoListData[todoListData.length - 1];
    return lastTodo.id + 1;
  }

  return 1;
};

const todoListState = new State<Todo[]>([]);

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
      new Todo(false, getUseableId(), title, 1),
    ]);
  };
  app.appendChild(createFooterElement(handleSearch));
};

todoListState.addObserver((todoList: Todo[]) => {
  renderUI(todoList);
});

const todoListData = [..._todoListData].map((todoData) => {
  return Todo.createFromJson(todoData);
});
todoListState.setState(todoListData);
