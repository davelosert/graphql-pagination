import { describe, it, expect } from 'vitest';
import { parse } from 'graphql';
import { paginateSimple } from './paginateSimple';
import { MockOctokit } from './testHelpers/MockOctokit';

describe('paginate()', () => {
  const parseQuery = (query: string) => parse(query, { noLocation: true });
  it('calls api with query where the cursors are correctly inserted.', async () => {
    const { octokit, getCalledQuery } = MockOctokit();
    const paginate = paginateSimple(octokit);

    await paginate((cursor) => {
      return `
          repository(owner: "octokit", name: "rest.js") {
            issues(first: 10, after: ${cursor.create()}) {
              nodes {
                title
              }
            }
          }
      `;
    });
    
    const expeced = parseQuery(`
      query paginate($cursor1: String) {
        repository(owner: "octokit", name: "rest.js") {
          issues(first: 10, after: $cursor1) {
            nodes { 
              title
            }
          }
        }
      }
    `);
    expect(parseQuery(getCalledQuery(1))).toEqual(expeced)
  });
  
  it('.', async (): Promise<void> => {
    
  });
});
