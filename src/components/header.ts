//YYYY-MM-DD
const getDateString = (date: Date = new Date()) => {
  let year: number = date.getFullYear();

  let month: number | string = date.getMonth() + 1;
  if (month < 10) month = `0${month}`;

  let day: number | string = date.getDate();
  if (day < 10) day = `0${day}`;

  return `${year}-${month}-${day}`;
};

export const createHeaderElement = (todoCnt: Number): HTMLElement => {
  const element = document.createElement('div');
  element.setAttribute('class', 'header');

  element.innerHTML = `
    <h1>${getDateString()}</h1>
    <p class='msg'>할 일이 ${todoCnt}개 남았습니다</p>
  `;

  return element;
};
