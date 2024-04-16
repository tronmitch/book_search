//Define type defs
const typeDefs =`
type User {
    _id: ID
    username: String
    email: String
    savedBooks: [Book]
  }
  
  type Book {
    bookId: String
    title: String
    authors: [String]
    description: String
  }
  
  type Query {
    getSingleUser(userId: ID, username: String): User
  }
  
  type Mutation {
    createUser(username: String, email: String, password: String): AuthPayload
    login(username: String, password: String): AuthPayload
    saveBook(userId: ID, book: InputBook): User
    deleteBook(userId: ID, bookId: ID): User
  }
  
  input InputBook {
    bookId: String
    title: String
    authors: [String]
    description: String
  }
  
  type AuthPayload {
    token: String
    user: User
  }
  
`


//Export
module.exports = typeDefs




