type CursorFactory = {
  create: () => string;
};
type QueryFunc = (cursor: CursorFactory) => string;

const paginate = (queryFunc: QueryFunc) => {
  const cursors: string[] = [];
  const cursor = {
    create: () => {
      const cursorName = `$cursor${cursors.length + 1}`;
      cursors.push(cursorName);
      return cursorName;
    }
  }

  const result = queryFunc(cursor);
  const cursorArgs = cursors.map(cursorName => `${cursorName}: String`).join(', ');
  
  return `query paginate(${cursorArgs}) {${result}}`;
};

export {
  paginate
};
