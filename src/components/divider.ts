export const createDividerElement = () => {
  const element = document.createElement('div') as HTMLDivElement;
  element.setAttribute('class', 'divider');

  return element;
};
