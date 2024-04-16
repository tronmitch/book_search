const isFactored= true

if(!isFactored){
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
}

if (isFactored){
  const express = require('express');
  const { ApolloServer } = require('apollo-server-express');
  const path = require('path');
  const db = require('./config/connection');
  const {expressMiddleware} = require('@apollo/server/express4')
  const { typeDefs, resolvers } = require('./schema'); // Make sure to create these
  const { authMiddleware } = require('./utils/auth'); // Your existing auth middleware

  const app = express();
  const PORT = process.env.PORT || 3001;

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // // Apply JWT authentication middleware globally
  // app.use(authMiddleware);

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../build')));
  }

  // Set up Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => req // Pass the request object to the context
  });

  const startApolloServer = async () => {
    await server.start();
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use('/graphql', expressMiddleware(server, {
      context: authMiddleware
    }));
    
  }

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  // app.use('/graphql', expressMiddleware(server, {
  //   path: '/graphql',
  //   context: ({ req }) => ({
  //     ...authMiddleware(req)
  //   })
  // }));

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
  startApolloServer();
}


