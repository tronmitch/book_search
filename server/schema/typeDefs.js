const {gql} = require ('apollo-server-express')

//Define type defs
const typeDefs = gql`
type User {
    _id: ID
    username: String
    email: String
    password: String
  }
  
  type Book {
    bookId: String
    title: String
    authors: [String]
    description: String
    image: String
    link: String
  }
  
  type Query {
    me: User
    searchBookQuery(query: String!): [Book]
  }
  
  type Mutation {
    addUser(username: String, email: String, password: String): AuthPayload
    login(username: String, password: String): AuthPayload
    saveBook(userId: ID, book: InputBook): User
    deleteBook(userId: ID, bookId: ID): User
  }
  
  input InputBook {
    bookId: String
    title: String
    authors: [String]
    description: String
    image: String
    link: String
  }
  
  type AuthPayload {
    token: ID!
    user: User
  }
  
`

module.exports = typeDefs




