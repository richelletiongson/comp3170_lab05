import './index.css'
import Book from './Book'
import Footer from './Footer'
import Header from './AppHeader'
import AddBook from './AddBook'
import Modal from './Modal'
import { useState, useEffect } from 'react'

function App() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [showAddBook, setShowAddBook] = useState(false);
  const [showEditBook, setShowEditBook] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState('All');

  useEffect(() => {
    const savedBooks = localStorage.getItem('books');
    if (savedBooks) {
      const parsedBooks = JSON.parse(savedBooks);
      setBooks(parsedBooks);
      setFilteredBooks(parsedBooks);
    } else {

      setBooks([]);
      setFilteredBooks([]);
    }
    setIsInitialized(true);
  }, []);

  
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('books', JSON.stringify(books));
    }
  }, [books, isInitialized]);


  useEffect(() => {
    if (selectedPublisher === 'All') {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(book => book.publisher === selectedPublisher);
      setFilteredBooks(filtered);
    }
  }, [books, selectedPublisher]);


  const handleNewButtonClick = () => {
    setShowAddBook(!showAddBook);
  };

  const handleEditButtonClick = () => {
    const selectedBook = books.find(book => book.selected);
    if (selectedBook) {
      setEditingBook(selectedBook);
      setShowEditBook(true);
    }
  };

  const handleAddBook = (newBook) => {
    const bookWithId = {
      id: `book_${Date.now()}_${Math.random()}`,
      ...newBook,
      selected: false
    };
    setBooks(prev => [...prev, bookWithId]);
    setShowAddBook(false);
  };

  const handleEditBook = (updatedBook) => {
    setBooks(prev => prev.map(book => 
      book.id === editingBook.id ? { ...updatedBook, id: editingBook.id, selected: false } : book
    ));
    setShowEditBook(false);
    setEditingBook(null);
  };

  const handleBookSelect = (bookId) => {
    setBooks(prev => prev.map(book => ({
      ...book,
      selected: book.id === bookId ? !book.selected : false 
    })));
  };

  const handleDeleteBook = () => {
    setBooks(prev => prev.filter(book => !book.selected));
  };

  const handlePublisherFilter = (e) => {
    setSelectedPublisher(e.target.value);
  };

  // Get unique publishers for the dropdown
  const getUniquePublishers = () => {
    const publishers = books.map(book => book.publisher).filter(Boolean);
    return [...new Set(publishers)];
  };

  return (
    <div className="app">    
      <Header></Header>  
      <main className="main-content">
        <div className="filter-section">
          <label htmlFor="publisher-filter">filter by publisher:</label>
          <select 
            id="publisher-filter"
            value={selectedPublisher} 
            onChange={handlePublisherFilter}
            className="publisher-filter"
          >
            <option value="All">All</option>
            {getUniquePublishers().map(publisher => (
              <option key={publisher} value={publisher}>{publisher}</option>
            ))}
          </select>
        </div>
        
        <div className="content">
          <div className="new-button-column">
            <button className="new" onClick={handleNewButtonClick}>NEW</button>
            <button className="edit" onClick={handleEditButtonClick}>EDIT</button>
            <button className="delete" onClick={handleDeleteBook}>DELETE</button>
          </div>
          
          <div className="books-container">
            {filteredBooks.map((book) => (
              <Book 
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                publisher={book.publisher}
                price={book.price}
                image={book.image}
                url={book.url}
                selected={book.selected}
                onSelect={handleBookSelect}
              />
            ))}
          </div>
        </div>
        
        <Modal 
          isOpen={showAddBook} 
          onClose={() => setShowAddBook(false)}
          title="Add Book"
        >
          <AddBook onAddBook={handleAddBook} />
        </Modal>
        
        <Modal 
          isOpen={showEditBook} 
          onClose={() => setShowEditBook(false)}
          title="Edit Book"
        >
          <AddBook onAddBook={handleEditBook} initialData={editingBook} />
        </Modal>
      </main>
      <Footer></Footer>
    </div>
  );
}

export default App;
