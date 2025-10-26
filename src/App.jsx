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


  const handleNewButtonClick = () => {
    setShowAddBook(!showAddBook);
  };

  const handleAddBook = (newBook) => {
    const bookWithId = {
      id: `book_${Date.now()}`,
      ...newBook,
      selected: false
    };
    setBooks(prev => [...prev, bookWithId]);
    setShowAddBook(false);
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

  return (
    <div className="app">    
      <Header></Header>  
      <main className="main-content">
        <div className="content">
          <div className="new-button-column">
            <button className="new" onClick={handleNewButtonClick}>NEW</button>
            <button className="edit">EDIT</button>
            <button className="delete" onClick={handleDeleteBook}>DELETE</button>
          </div>
          
          <Modal 
            isOpen={showAddBook} 
            onClose={() => setShowAddBook(false)}
            title="Add Book"
          >
            <AddBook onAddBook={handleAddBook} />
          </Modal>
          
          <div className="books-container">
            {books.map((book) => (
              <Book 
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                image={book.image}
                url={book.url}
                selected={book.selected}
                onSelect={handleBookSelect}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer></Footer>
    </div>
  );
}

export default App;
