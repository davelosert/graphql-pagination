import { Octokit } from '@octokit/core';

type CursorFactory = {
  create: () => string;
};
type QueryFunc = (cursor: CursorFactory) => string;

const paginateSimple = (octokit: Octokit) => {
  return async (queryFunc: QueryFunc) => {
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

    await octokit.graphql(`query paginate(${cursorArgs}) {${result}}`);
};
;
};


export {
  paginateSimple
};
