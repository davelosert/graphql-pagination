import { describe, it, expect } from 'vitest';
import { extractPaginatedItems } from './extractPaginatedItems';

describe('extractPagingInfo()', () => {
  it('finds the cursors for "after" variables.', () => {
    const result = extractPaginatedItems(`
      query paginate($cursor: String) {
        repository(owner: "octokit", name: "rest.js") {
          issues(first: 10, after: $cursor) {
            nodes {
              title
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
    `);
    
    expect(result).toEqual([{
      location: 'repository.issues',
      cursorVariableName: 'cursor'
    }]);
  });
});
