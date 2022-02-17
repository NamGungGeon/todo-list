export const createFooterElement = (handleCreate: (title: string) => void) => {
  const footerElement = document.createElement('div');

  footerElement.innerHTML = `
    <input type='text' placeholder='할 일 추가' id='createTodo'/>
  `;

  const inputCreateTodoElement = footerElement.querySelector(
    '#createTodo'
  ) as HTMLInputElement;

  inputCreateTodoElement.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
      const title = inputCreateTodoElement.value;
      if (title.length > 0) {
        handleCreate(title);
      }
    }
  });

  return footerElement;
};
