import { parse, visit, Kind } from 'graphql';

interface PaginationItem {
  location: string;
  cursorVariableName: string;
};

const extractPaginatedItems = (query: string): PaginationItem[] => {
  const ast = parse(query, { noLocation: true });

  const currentPath: string[] = [];
  const paginationInfos: PaginationItem[] = [];

  visit(ast, {
    enter(node, key, parent, path, ancestors) {
      if(node.kind === Kind.FIELD) {
        currentPath.push(node.name.value);
      }

      if(node.kind === Kind.ARGUMENT 
        && node.name.value === 'after'
        && node.value.kind === Kind.VARIABLE
        ) {

          paginationInfos.push({
            location: currentPath.join('.'),
            cursorVariableName: node.value.name.value
          });
      }
    },
    leave(node) {
      if(node.kind === Kind.FIELD) {
        currentPath.pop();
      }
    }
  });

  return paginationInfos;
};

export {
  extractPaginatedItems
};

export type {
  PaginationItem
};
