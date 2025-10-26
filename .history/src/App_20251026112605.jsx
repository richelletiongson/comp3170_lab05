import './index.css'
import Book from './Book'
import Footer from './Footer'
import Header from './AppHeader'
import AddBook from './AddBook'
import Modal from './Modal'
import { useState, useEffect } from 'react'
import booksData from '../data/book.json'

function App() {
  const [books, setBooks] = useState([]);
  const [showAddBook, setShowAddBook] = useState(false);
  const [showEditBook, setShowEditBook] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Load books from localStorage on component mount
  useEffect(() => {
    const savedBooks = localStorage.getItem('books');
    if (savedBooks) {
      const parsedBooks = JSON.parse(savedBooks);
      setBooks(parsedBooks);
      setFilteredBooks(parsedBooks);
    } else {
      // Initialize with sample data if no saved books
      const initialBooks = booksData.map(book => ({
        ...book,
        id: `book_${Date.now()}_${Math.random()}`,
        author: 'Unknown Author', // Default author since sample data doesn't have it
        publisher: 'Unknown Publisher', // Default publisher
        selected: false
      }));
      setBooks(initialBooks);
      setFilteredBooks(initialBooks);
      localStorage.setItem('books', JSON.stringify(initialBooks));
    }
  }, []);

  // Save books to localStorage whenever books state changes
  useEffect(() => {
    if (books.length > 0) {
      localStorage.setItem('books', JSON.stringify(books));
    }
  }, [books]);

  // Filter books based on search term and filter type
  useEffect(() => {
    let filtered = books;
    
    if (searchTerm.trim()) {
      filtered = books.filter(book => {
        if (filterType === 'author') {
          return book.author.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (filterType === 'publisher') {
          return book.publisher.toLowerCase().includes(searchTerm.toLowerCase());
        } else {
          return book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 book.publisher.toLowerCase().includes(searchTerm.toLowerCase());
        }
      });
    }
    
    setFilteredBooks(filtered);
  }, [books, searchTerm, filterType]);


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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  return (
    <div className="app">    
      <Header></Header>  
      <main className="main-content">
        <div className="content">
          <div className="new-button-column">
            <button className="new" onClick={handleNewButtonClick}>NEW</button>
            <button className="edit" onClick={handleEditButtonClick}>EDIT</button>
            <button className="delete" onClick={handleDeleteBook}>DELETE</button>
          </div>
          
          <div className="books-container">
            {books.map((book) => (
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
