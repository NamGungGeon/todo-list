export type Observer<T> = (state: T) => void;

export default class State<T> {
  private state: T;
  private observers: Observer<T>[] = [];
  constructor(initialState: T) {
    this.state = initialState;
  }

  //setState가 호출될 때 마다 observers 모두 호출
  setState(nextState: T): void {
    this.state = nextState;

    this.observers.forEach((observer: Observer<T>) => {
      observer(this.state);
    });
  }

  addObserver(observer: Observer<T>): void {
    this.observers.push(observer);
  }
  removeObserver(observer: Observer<T>): void {
    for (let i = 0; i < this.observers.length; i++) {
      if (this.observers[i] === observer) {
        this.observers.splice(i, 1);
        break;
      }
    }
  }
  removeAllObservers(): void {
    while (this.observers.length) {
      this.observers.pop();
    }
  }
}
