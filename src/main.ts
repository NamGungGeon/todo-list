import './style.css';

import { createDividerElement } from './components/divider';
import { createFooterElement } from './components/footer';
import { createHeaderElement } from './components/header';
import { createTodoElement } from './components/todo';
import { Todo } from './models/todo';
import _todoListData from './values/todo.sm.json';
import State from './state';
import { createTrashHoleElement } from './components/trashhole';
import { createTodoViewOptionElement } from './components/viewOptions';
import { createTodo, deleteTodo, getTodoList, updateTodo } from './http/todo';

type TodoListState = {
  todoList: Todo[];
  listingStyle: 'listing-vertical' | 'listing-grid';
};
const todoListState = new State<TodoListState>({
  todoList: [],
  listingStyle: 'listing-vertical',
});

const app = document.querySelector<HTMLDivElement>('#app')!;

const getUsableTodoId = (todoListData: Todo[]) => {
  if (todoListData.length) {
    const lastTodo = todoListData[todoListData.length - 1];
    return lastTodo.id + 1;
  }

  return 1;
};

const renderUI = (state: TodoListState) => {
  const { todoList, listingStyle } = state;

  console.log('renderUI', todoListData);
  //remove todo
  todoList.every((todo: Todo, idx: number) => {
    //id===-1이면 삭제 버튼이 눌린 todo
    if (todo.id === -1) {
      todoList.splice(idx, 1);
      return false;
    }
    return true;
  });

  //reset
  app.innerHTML = '';

  //header
  const restTodoCnt = todoList.reduce<number>(
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

  //body
  const handleRemove = (targetTodoId: number) => {
    const fIndex = todoList.findIndex((todo: Todo) => {
      return todo.id === targetTodoId;
    });
    if (fIndex !== -1) {
      deleteTodo(todoList[fIndex])
        .then(() => {
          const nextTodoList = [...todoList];
          nextTodoList.splice(fIndex, 1);

          todoListState.setState({
            ...state,
            todoList: nextTodoList,
          });
        })
        .catch(console.error);
    }
  };
  app.appendChild(createTrashHoleElement(handleRemove));

  const todoViewOptionsElement = createTodoViewOptionElement(
    listingStyle,
    (listingStyle) => {
      todoListState.setState({
        ...state,
        listingStyle,
      });
    }
  );
  app.appendChild(todoViewOptionsElement);

  const todolistElement = document.createElement('div');
  todolistElement.classList.add('todolist');
  todolistElement.classList.add(listingStyle);

  app.appendChild(todolistElement);
  const handleUpdate = (todo: Todo): void => {
    console.log('update target todo', todo);
    updateTodo(todo)
      .then(() => {
        todoListState.setState({
          ...state,
          todoList: [...todoList],
        });
      })
      .catch(console.error);
  };
  const handleSwap = (todo: Todo, droppedTodoId: number) => {
    console.log('handleSwap');
    const currentTodoId = todo.id;

    const targetIndexes = [
      todoList.findIndex((todo) => todo.id === currentTodoId),
      todoList.findIndex((todo) => todo.id === droppedTodoId),
    ];
    if (targetIndexes[0] !== -1 && targetIndexes[1] !== -1) {
      if (targetIndexes[0] === targetIndexes[1]) return;
      //valid
      const nextTodoList = [...todoList];

      const tmpOrderId = nextTodoList[targetIndexes[0]].orderId;
      nextTodoList[targetIndexes[0]].orderId =
        nextTodoList[targetIndexes[1]].orderId;
      nextTodoList[targetIndexes[1]].orderId = tmpOrderId;

      Promise.all(
        targetIndexes.map((index: number) => {
          return updateTodo(nextTodoList[index]);
        })
      )
        .then((result) => {
          console.log('swapped', result);
        })
        .catch((e) => {
          console.error('swap error', e);
        });

      todoListState.setState({
        ...state,
        todoList: nextTodoList,
      });
    }
  };
  todoList
    .sort((t1, t2) => t1.orderId - t2.orderId)
    .map((todo: Todo) => {
      const todoElement: HTMLDivElement = createTodoElement(
        todo,
        handleUpdate,
        handleSwap,
        (todo) => handleRemove(todo.id)
      );
      todolistElement.appendChild(todoElement);
    });
  if (todoList.length === 0) todolistElement.remove();

  //divider
  app.appendChild(createDividerElement());

  //footer
  const handleCreateTodo = (title: string) => {
    //handle keyword...
    console.log(title);
    const newTodo = new Todo(
      false,
      getUsableTodoId(todoList),
      title,
      1,
      undefined
    );
    createTodo(newTodo)
      .then(() => {
        console.log('created');
        todoListState.setState({
          ...state,
          todoList: [...todoList, newTodo],
        });
      })
      .catch((e) => {
        console.error('createTodo', e);
      });
  };
  app.appendChild(createFooterElement(handleCreateTodo));
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

todoListState.addObserver((state: TodoListState) => {
  const { todoList } = state;
  renderUI(state);

  localStorage.setItem('todoList', JSON.stringify(todoList));
});

getTodoList()
  .then((todoList: Todo[]) => {
    todoListState.setState({
      todoList: todoList.map((todo) => Todo.createFromJson(todo)),
      listingStyle: 'listing-vertical',
    });
  })
  .catch((e) => {
    console.error(e);
    app.innerHTML = `
      <p>json-server가 동작하지 않는 것 같습니다</p>
      <br/>
      <pre>
        ${e.toString().trim()}
      </pre>
    `;
  });
