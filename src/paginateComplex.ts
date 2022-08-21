import { Octokit } from '@octokit/core';
import { extractPaginatedItems } from './extractPaginatedItems';

const getObjectByPosition = (obj: any, positionStr: string) => {
  const position = positionStr.split('.');
  return position.reduce((current, nextProperty) => current[nextProperty], obj);
}


const paginateComplex = (octokit: Octokit) => {
  return async (query: string) => {
    // Find Argument with name 'after' and get 
    // 1. the value.name.value of a type 'Variable'
    // 2. the path to the paginated entity (which is either nodes or edges)
    const paginationItems = extractPaginatedItems(query);
    const { cursorVariableName, location } = paginationItems[0];

    let hasNextPage = true;
    let nextCursor = undefined;
    let allNodes = [];

    while(hasNextPage) {
      const result = await octokit.graphql(query, {
        [cursorVariableName]: nextCursor
      }) as any;
      const paginatedEntity = getObjectByPosition(result, location);
      const { nodes, pageInfo } = paginatedEntity;
      allNodes.push(...nodes);
      hasNextPage = pageInfo.hasNextPage;
      nextCursor = pageInfo.endCursor;
    }
    
    return {
      repository: {
        issues: allNodes
      }
    };
  }
};


export {
  paginateComplex
};
