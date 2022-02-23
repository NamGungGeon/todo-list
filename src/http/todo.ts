import http from '.';
import { Todo } from '../models/Todo';

const host = `http://localhost:3001`;

export const getTodoList = (): Promise<Todo[]> => {
  return http(`${host}/todolist`);
};

export const createTodo = (todo: Todo) => {
  return http(`${host}/todolist`, {
    method: 'POST',
    body: JSON.stringify(todo),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const updateTodo = (todo: Todo) => {
  return http(`${host}/todolist/${todo.id}`, {
    method: 'PUT',
    body: JSON.stringify(todo),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const deleteTodo = (todo: Todo) => {
  return http(`${host}/todolist/${todo.id}`, {
    method: 'DELETE',
  });
};
