import { Todo } from './Todo';

export default class TodoList {
  todoList: Todo[] = [];

  constructor(todoList: Todo[]) {
    this.todoList = todoList;
  }

  init() {}
}
