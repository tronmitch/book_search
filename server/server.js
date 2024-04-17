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




