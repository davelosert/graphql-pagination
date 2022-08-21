import { Octokit } from '@octokit/core';
import { paginateSimple } from './paginateSimple';

export function paginateGraphql(octokit: Octokit) {
  return {
    paginateGraphql: paginateSimple(octokit),
  };
}
