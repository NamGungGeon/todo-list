import http from '.';
import { Todo } from '../models/todo';

const host = `http://localhost:3001`;

export const getTodoList = (): Promise<Todo[]> => {
  return http(`${host}/todolist`);
};

export const createTodo = (todo: Todo) => {
  console.log(JSON.stringify(todo));
  return http(`${host}/todolist`, {
    method: 'POST',
    body: JSON.stringify(todo),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
