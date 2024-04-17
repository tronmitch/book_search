import { useState, useEffect } from 'react';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';
import { useMutation, useLazyQuery } from '@apollo/client';
import { SAVE_BOOK  } from '../graphql/mutations';
import { SEARCH_BOOKS  } from '../graphql/queries';
import Auth from '../utils/auth';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';

const SearchBooks = () => {
    const [searchedBooks, setSearchedBooks] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());
    const [searchBookQuery, { loading, data }] = useLazyQuery(SEARCH_BOOKS);
    const [saveBookMutation, { error }] = useMutation(SAVE_BOOK);



    const handleFormSubmit = async (event) => {
        event.preventDefault();
        if (!searchInput) {
            return false;
        }
        try {
          console.log("Search Tag", searchInput)
          await searchBookQuery({ variables: { query: searchInput } });
          console.log("Search Results", searchBookQuery)
          setSearchInput('');
        } catch (err) {
          console.error(err);
        }
    };

    const handleSaveBook = async (bookId) => {
        const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
            return false;
        }

        try {
            const { data } = await saveBookMutation({
                variables: { book: bookToSave },
                context: { headers: { Authorization: `Bearer ${token}` } }
            });
            setSavedBookIds([...savedBookIds, bookToSave.bookId]);
        } catch (err) {
            console.error('Error saving the book:', err);
        }
    };

    useEffect(() => {
      return () => saveBookIds(savedBookIds);
  }, [savedBookIds]);

  useEffect(() => {
    if (data) {
      console.log("Data received from GraphQL:", data);
      setSearchedBooks(data.searchBooks || []);
    }
  }, [data]);

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className='pt-5'>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border='dark'>
                  {book.image ? (
                    <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                        className='btn-block btn-info'
                        onClick={() => handleSaveBook(book.bookId)}>
                        {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                          ? 'This book has already been saved!'
                          : 'Save this Book!'}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks;
