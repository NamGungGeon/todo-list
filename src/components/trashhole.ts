export const createTrashHoleElement = (
  handleRemove: (todoId: number) => void
): HTMLElement => {
  const element: HTMLDivElement = document.createElement('div');
  element.setAttribute('id', 'trashhole');

  element.addEventListener('dragover', (e: Event) => {
    e.preventDefault();
    element.classList.add('active');
  });
  element.addEventListener('dragleave', (e: Event) => {
    e.preventDefault();
    element.classList.remove('active');
  });
  element.addEventListener('drop', (e: DragEvent) => {
    e.preventDefault();
    element.classList.remove('active');
    console.log('on Drop', e);
    const targetTodoId: number = Number(e.dataTransfer?.getData('todoId') || 0);
    if (targetTodoId > 0) {
      //valid
      handleRemove(targetTodoId);
    }
  });

  element.innerHTML = `
    <p>이곳에 삭제할 할 일을 드래그&드롭 하세요</p>
  `;

  return element;
};
