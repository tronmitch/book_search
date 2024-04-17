import { gql } from '@apollo/client';

export const GET_ME = gql`
  query getMe {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        title
        authors
        description
      }
    }
  }
`;

export const SEARCH_BOOKS = gql`
  query searchBookQuery($query: String!) {
    searchBookQuery(query: $query) {
      bookId
      title
      authors
      description
      image
      link
    }
  }
`;