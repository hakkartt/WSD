const data = [];

const add = (element) => {
  data.push(element);
};

const isEmpty = () => {
  return data.length === 0;
};

export { add, isEmpty };