export const createTodoViewOptionElement = (
  currentOption: 'listing-vertical' | 'listing-grid',
  handleUpdateOption: (nextOption: 'listing-vertical' | 'listing-grid') => void
): HTMLDivElement => {
  const todoStyleOptionsElement = document.createElement('div');
  todoStyleOptionsElement.classList.add('todoStyleOptions');
  todoStyleOptionsElement.innerHTML = `
    ${
      currentOption === 'listing-grid'
        ? '<button id="listingVerticalButton">리스트보기</button>'
        : '<button id="listingGridButton">격자보기</button>'
    }
  `;
  todoStyleOptionsElement
    .querySelector('#listingVerticalButton')
    ?.addEventListener('click', () => {
      handleUpdateOption('listing-vertical');
    });
  todoStyleOptionsElement
    .querySelector('#listingGridButton')
    ?.addEventListener('click', () => {
      handleUpdateOption('listing-grid');
    });

  return todoStyleOptionsElement;
};
