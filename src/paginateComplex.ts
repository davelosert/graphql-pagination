import { Octokit } from '@octokit/core';
import { parse } from 'graphql';

const paginateComplex = (octokit: Octokit) => {
  return async (query: string) => {
    const ast = parse(query, { noLocation: true }) as any;
    const cursorName = ast.definitions[0].selectionSet.selections[0].selectionSet.selections[0].arguments[1].value.name.value;
    const cursorPosition = ['repository', 'issues'];
    
    let hasNextPage = true;
    let nextCursor = undefined;
    let allNodes = [];
    

    while(hasNextPage) {
      const result = await octokit.graphql(query, {
        [cursorName]: nextCursor
      }) as any;
      console.log(`Result`, JSON.stringify(result, null, 2));
      const nodes = result[cursorPosition[0]][cursorPosition[1]].nodes;
      allNodes.push(nodes);

      const pageInfo = result[cursorPosition[0]][cursorPosition[1]].pageInfo;
      hasNextPage = pageInfo.hasNextPage;
      nextCursor = pageInfo.endCursor;
    }
    
    return allNodes;
  }
};


export {
  paginateComplex
};
