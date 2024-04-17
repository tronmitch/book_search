import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink  } from '@apollo/client';
import Navbar from './components/Navbar';
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

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

