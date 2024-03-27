const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  // app.use(express.static(path.join(__dirname, '../client/build')));
  app.use(express.static(path.join(__dirname, '../build')));
}

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});


// const express = require('express');
// const { ApolloServer } = require('apollo-server-express');
// const path = require('path');
// const db = require('./config/connection');
// const { typeDefs, resolvers } = require('./schemas'); // Make sure to create these
// const { authMiddleware } = require('./utils/auth'); // Your existing auth middleware

// const app = express();
// const PORT = process.env.PORT || 3001;

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // Apply JWT authentication middleware globally
// app.use(authMiddleware);

// // if we're in production, serve client/build as static assets
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../build')));
// }

// // Set up Apollo Server
// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   context: ({ req }) => req // Pass the request object to the context
// });

// // Apply Apollo GraphQL middleware and set the path to /graphql
// server.applyMiddleware({ app, path: '/graphql' });

// db.once('open', () => {
//   app.listen(PORT, () => {
//     console.log(`🌍 Now listening on localhost:${PORT}`);
//     console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
//   });
// });
