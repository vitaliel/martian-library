// client
import { ApolloClient } from 'apollo-client';
// cache
import { InMemoryCache } from "apollo-cache-inmemory";
// links
import { HttpLink } from "apollo-link-http";
import { ApolloLink, Observable } from "apollo-link";
import ActionCableLink from "graphql-ruby-client/subscriptions/ActionCableLink";
import { onError } from "apollo-link-error";

import { createConsumer } from "@rails/actioncable"

export const createCache = () => {
  const cache = new InMemoryCache();
  if (process.env.NODE_ENV === 'development') {
    window.secretVariableToStoreCache = cache
  }
  return cache;
}

// getTokens from meta tags
const getTokens = () => {
  const tokens = {
    'X-CSRF-Token': document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute('content')
  }
  const authToken = localStorage.getItem('mlToken');
  return authToken ? { ...tokens, Authorization: authToken } : tokens;
}

const setTokenForOperation = async operation =>
  operation.setContext({
    headers: {
      ...getTokens()
    }
  });

// link with token
const createLinkWithToken = () =>
  new ApolloLink(
    (operation, forward) =>
      new Observable(observer => {
        let handle;
        Promise.resolve(operation)
          .then(setTokenForOperation)
          .then(() => {
            handle = forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            })
          })
          .catch((observer.error.bind(observer)));
        return () => {
          if (handle) handle.unsubscribe();
        }
      })
  )

// log errors
const logError = (error) => console.error(error);
// create error link
const createErrorLink = () => onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    logError('GraphQL - Error', {
      errors: graphQLErrors,
      operationName: operation.operationName,
      variables: operation.variables,
    })
  }
  if (networkError) {
    logError('GraphQL - NetworkError', networkError);
  }
});

// http link
const createHttpLink = () => new HttpLink({
  uri: '/graphql',
  credentials: 'include',
});

const getCableUrl = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.hostname;
  const port = process.env.CABLE_PORT || '3000';
  const authToken = localStorage.getItem('mlToken')
  return `${protocol}//${host}:${port}/cable?token=${authToken}`;
}

const createActionCableLink = () => {
  const cable = createConsumer(getCableUrl());
  return new ActionCableLink({ cable });
}

const hasSubscriptionOperation = ({ query: { definitions } }) =>
  definitions.some(
    ({ kind, operation }) =>
      kind === 'OperationDefinition' && operation === 'subscription'
  );

export const createClient = (cache, requestLink) => {
  return new ApolloClient({
    link: ApolloLink.from([
      createErrorLink(),
      createLinkWithToken(),
      ApolloLink.split(
        hasSubscriptionOperation,
        createActionCableLink(),
        createHttpLink(),
      )
    ]),
    cache
  })
};
