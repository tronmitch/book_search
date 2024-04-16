import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import Navbar from './components/Navbar';

const client = new ApolloClient({
  uri: '/graphql',
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

