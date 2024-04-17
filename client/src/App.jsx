import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink  } from '@apollo/client';
import Navbar from './components/Navbar';

const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql', // Make sure this URI is correct
});

const httpLinkProd = createHttpLink({
  uri: '/graphql', // Make sure this URI is correct
});

const link = process.env.NODE_ENV === 'production' ? httpLinkProd : httpLink;

const client = new ApolloClient({
  uri: '/graphql',
  link: link,
  cache: new InMemoryCache()
})

function App() {
  return (
    <ApolloProvider client={client}> {/* ApolloProvider wraps your React app and provides the Apollo Client to all components */}
      <>
        <Navbar />
        <Outlet /> {/* This component will render the matched route's component */}
      </>
    </ApolloProvider>
  );
}

export default App;

