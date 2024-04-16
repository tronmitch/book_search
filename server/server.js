  // const express = require('express');
  // const { ApolloServer } = require('apollo-server-express');
  // const path = require('path');
  // const db = require('./config/connection');
  // const {expressMiddleware} = require('@apollo/server/express4')
  // const { typeDefs, resolvers } = require('./schema'); // Make sure to create these
  // const { authMiddleware } = require('./utils/auth'); // Your existing auth middleware

  // const app = express();
  // const PORT = process.env.PORT || 3001;

  // app.use(express.urlencoded({ extended: true }));
  // app.use(express.json());

  // // // Apply JWT authentication middleware globally
  // // app.use(authMiddleware);

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

  // const startApolloServer = async () => {
  //   await server.start();
  //   app.use(express.urlencoded({ extended: false }));
  //   app.use(express.json());
  //   app.use('/graphql', expressMiddleware(server, {
  //     context: authMiddleware
  //   }));
    
  // }

  // if (process.env.NODE_ENV === 'production') {
  //   app.use(express.static(path.join(__dirname, '../client/dist')));

  //   app.get('*', (req, res) => {
  //     res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  //   });
  // }


  // db.once('open', () => {
  //   app.listen(PORT, () => {
  //     console.log(`🌍 Now listening on localhost:${PORT}`);
  //     console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  //   });
  // });
  // startApolloServer();

  const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const db = require('./config/connection');
const { typeDefs, resolvers } = require('./schema'); // Ensure these are defined
const { authMiddleware } = require('./utils/auth'); // Your existing auth middleware

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse body data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files in production mode
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Use the auth middleware to add user info to the context
    return { user: authMiddleware(req) };
  }
});

// Function to start Apollo Server and apply middleware
async function startApolloServer() {
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`🚀 GraphQL ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
}

// Start the Apollo Server
startApolloServer();

// Serve the React application in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}




