const isRefactored = true

if (!isRefactored)
{const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // function for our authenticated routes
  authMiddleware: function (req, res, next) {
    // allows token to be sent via  req.query or headers
    let token = req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return res.status(400).json({ message: 'You have no token!' });
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
      return res.status(400).json({ message: 'invalid token!' });
    }

    // send to next endpoint
    next();
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
}

if (isRefactored){
const { ApolloServer } = require('apollo-server');
const jwt = require('jsonwebtoken');
const {typeDefs, resolvers} = require('../schema'); // Assume these are defined elsewhere
// const resolvers = require('../'); // Assume these are defined elsewhere

const secret = 'mysecretsshhhhh';
const expiration = '2h';

// Adjusted authentication function to work with Apollo Server
const authMiddleware = (context) => {
  // Extract the token from the context
  let token = context.req.query.token || context.req.headers.authorization;

  if (context.req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    // If there's no token, return the context without user data
    return context;
  }

  try {
    // If a token is found, verify it and attach the user data to the context
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    context.user = data;
  } catch (e) {
    console.log('Invalid token');
  }

  return context;
};

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Use the authMiddleware function within the context creation to inject user data
    const context = authMiddleware({ req });
    return context;
  },
});

// Launch the server
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

// signToken function remains the same
const signToken = function ({ username, email, _id }) {
  const payload = { username, email, _id };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};

module.exports = { signToken };
}