export class Todo {
  completed: boolean = false;
  id: number = -1;
  title: string = "";
  userId: number = -1;

  constructor(completed: boolean, id: number, title: string, userId: number) {
    this.completed = completed;
    this.id = id;
    this.title = title;
    this.userId = userId;
  }

  static createFromJson(todo: Todo) {
    const { completed, id, title, userId } = todo;
    return new Todo(completed, id, title, userId);
  }
}
