import { describe, it, expect } from 'vitest';
import { parse } from 'graphql';
import { MockOctokit } from './testHelpers/MockOctokit';
import { paginateComplex } from './paginateComplex';


describe('paginateComplex()', () => {
  it('deducts the cursor from the query and calls all pages.', async () => {
    const { octokit,  getPassedVariables, getCallCount } = MockOctokit([
      {
        repository: {
          issues: { 
            nodes: [{ title: 'issue 1' }],  
            pageInfo: { hasNextPage: true, endCursor: 'endCursor1' }
          }
        }
      },
      {
        repository: {
          issues: { 
            nodes: [{ title: 'issue 2' }],
            pageInfo: { hasNextPage: false, endCursor: 'endCursor2' }
          }
        }
      },
      
    ]);
    
    const paginate = paginateComplex(octokit);
    
    await paginate(`
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
    `)
    
    expect(getCallCount()).toEqual(2);
    const [first, second] = getPassedVariables();
    expect(first).toEqual({});
    expect(second).toEqual({ cursor: 'endCursor1' });
  });
});
