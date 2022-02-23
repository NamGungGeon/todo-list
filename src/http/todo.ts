import http from '.';
import { Todo } from '../models/todo';

const host = `http://localhost:3001`;

export const getTodoList = (): Promise<Todo[]> => {
  return http(`${host}/todolist`);
};
