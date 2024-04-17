import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME, REMOVE_BOOK } from '../graphql/mutations';
import { removeBookId } from '../utils/localStorage';
import Auth from '../utils/auth';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

const SavedBooks = () => {
  const [userData, setUserData] = useState({});
  
  const { data, loading, error } = useQuery(GET_ME, {
    onCompleted: data => {
      setUserData(data.me);
    }
  });

  const [deleteBookMutation] = useMutation(REMOVE_BOOK, {
    onCompleted: (data) => {
      // Assuming `bookId` comes from the mutation response, if not, adjust accordingly
      removeBookId(data.bookId);
    }
  });

  const handleDeleteBook = async (bookId) => {
    try {
      await deleteBookMutation({
        variables: { bookId: bookId }
      });
    } catch (err) {
      console.error('Error deleting the book:', err);
    }
  };

  if (loading) return <h2>LOADING...</h2>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <div fluid className="text-light bg-dark p-5">
          <Container>
              <h1>Viewing saved books!</h1>
          </Container>
      </div>
      <Container>
          <h2 className='pt-5'>
              {userData.savedBooks && userData.savedBooks.length
                  ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
                  : 'You have no saved books!'}
          </h2>
          <Row>
              {userData.savedBooks && userData.savedBooks.map((book) => (
                  <Col md="4" key={book.bookId}>
                      <Card border='dark'>
                          {book.image && <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />}
                          <Card.Body>
                              <Card.Title>{book.title}</Card.Title>
                              <p className='small'>Authors: {book.authors}</p>
                              <Card.Text>{book.description}</Card.Text>
                              <Button
                                  className='btn-block btn-danger'
                                  onClick={() => handleDeleteBook(book.bookId)}
                              >
                                  Delete this Book!
                              </Button>
                          </Card.Body>
                      </Card>
                  </Col>
              ))}
          </Row>
      </Container>
    </div>
  );
};

export default SavedBooks;
