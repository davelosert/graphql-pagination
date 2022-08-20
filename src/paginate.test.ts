import { describe, it, expect } from 'vitest';
import { stripIndents } from 'common-tags';
import { paginate } from './paginate';

describe('paginate()', () => {
  it('returns a query where the cursor is correctly inserted automatically.', async () => {
    const result = await paginate((cursor) => {
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
    
    expect(stripIndents(result)).toEqual(stripIndents`
      query paginate($cursor1: String) {
        repository(owner: "octokit", name: "rest.js") {
          issues(first: 10, after: $cursor1) {
            nodes {
              title
            }
          }
        }
      }
    `)
  });
});
