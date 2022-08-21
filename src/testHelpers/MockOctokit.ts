import { Octokit } from '@octokit/core';
import fetchMock from 'fetch-mock';

const MockOctokit = (returnData = [{}]) => {
    let calledQueries: string[] = [];
    let passedVariables: any[] = [];
    let callCount = 0;
    const mock = fetchMock
      .sandbox()
      .post("https://api.github.com/graphql", (url, options) => {
        calledQueries.push(JSON.parse(options.body!.toString()).query);
        passedVariables.push(JSON.parse(options.body!.toString()).variables);
        callCount = callCount + 1;
        return { data: returnData.shift()};
    }, { repeat: 2 });

    const octokit = new Octokit({
      request: {
        fetch: mock
      }
    });
    
    return {
      octokit,
      getCallCount: () => callCount,
      getCalledQueries: () => calledQueries,
      getCalledQuery: (index: number) => calledQueries[index - 1],
      getPassedVariables: () => passedVariables,
      getPassedVariablesForCall: (index: number) => passedVariables[index - 1]
    };
}

export {
  MockOctokit
};
