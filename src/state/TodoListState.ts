import State from '.';
import * as http from '../http/todo';
import { Todo } from '../models/Todo';

export type ListingStyle = 'listing-vertical' | 'listing-grid';
export type TodoListStateType = {
  todoList: Todo[];
  listingStyle: ListingStyle;
};

export default class TodoListState extends State<TodoListStateType> {
  constructor() {
    super({
      todoList: [],
      listingStyle: 'listing-vertical',
    });
  }
  setState(nextState: TodoListStateType): void {
    super.setState({
      ...nextState,
    });
  }

  getRestTodoCnt() {
    const { todoList } = this.state;

    return todoList.reduce<number>((acc: number, todo: Todo): number => {
      if (!todo.completed) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }
  private getUsableTodoId() {
    const { todoList } = this.state;
    if (todoList.length) {
      const lastTodo = todoList[todoList.length - 1];
      return lastTodo.id + 1;
    }

    return 1;
  }

  addTodo(title: string): Todo {
    const newTodo = new Todo(
      false,
      this.getUsableTodoId(),
      title,
      1,
      undefined
    );
    http
      .createTodo(newTodo)
      .then(() => {
        console.log('created');
        this.setState({
          ...this.state,
          todoList: [...this.state.todoList, newTodo],
        });
      })
      .catch((e) => {
        console.error('createTodo', e);
      });

    return newTodo;
  }

  swapOrder(t1_idx: number, t2_idx: number) {
    if (t1_idx === t2_idx) return;
    //valid
    const nextTodoList = [...this.state.todoList];

    const tmpOrderId = nextTodoList[t1_idx].orderId;
    nextTodoList[t1_idx].orderId = nextTodoList[t2_idx].orderId;
    nextTodoList[t2_idx].orderId = tmpOrderId;

    this.setState({
      ...this.state,
      todoList: nextTodoList,
    });

    //sync with server
    Promise.all(
      [t1_idx, t2_idx].map((index: number) => {
        return http.updateTodo(nextTodoList[index]);
      })
    )
      .then((result) => {
        console.log('swapped', result);
      })
      .catch((e) => {
        console.error('swap error', e);
      });
  }
  //todo.id is immutable
  //never changed in server
  update(todo: Todo) {
    console.log('update target todo', todo);

    const idx = this.state.todoList.findIndex((td) => td.id === todo.id);
    if (idx !== -1) {
      const nextTodoList = [...this.state.todoList];
      nextTodoList[idx] = todo;

      http
        .updateTodo(todo)
        .then(() => {
          this.setState({
            ...this.state,
            todoList: nextTodoList,
          });
        })
        .catch(console.error);
    }
  }

  remove(todo: Todo) {
    const fIndex = this.state.todoList.findIndex((td: Todo) => {
      return td.id === todo.id;
    });
    if (fIndex !== -1) {
      http
        .deleteTodo(todo)
        .then(() => {
          const nextTodoList = [...this.state.todoList];
          nextTodoList.splice(fIndex, 1);

          this.setState({
            ...this.state,
            todoList: nextTodoList,
          });
        })
        .catch(console.error);
    }
  }

  setListingStyle(nextStyle: ListingStyle) {
    this.setState({
      ...this.state,
      listingStyle: nextStyle,
    });
  }

  async load() {
    const todoList = await http.getTodoList();
    this.setState({
      ...this.state,
      todoList: todoList.map((todo) => Todo.createFromJson(todo)),
    });

    return todoList;
  }
}
