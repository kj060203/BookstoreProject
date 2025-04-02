import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { deleteBook, fetchBooks } from '../api/BooksAPI';
import Pagination from '../components/Pagination';
import NewBookForm from '../components/NewBookForm';
import EditBookForm from '../components/EditBookForm';

const AdminBooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true); // Ensure loading state is true while fetching
        const data = await fetchBooks(page, pageNum, false, []);
        setBooks(data.books);
        setTotalPages(Math.ceil(data.totalNumBooks / page));
      } catch (error) {
        console.error(error);
        setError('Failed to fetch books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, [pageNum, page]); // Add `pageNum` and `page` to the dependency array

  const handleDelete = async (title: string) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this book?'
    );
    if (!confirmDelete) return;

    try {
      await deleteBook(title);
      setBooks(books.filter((book) => book.title !== title));
    } catch (error) {
      alert('Failed to delete book. Please try again');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="admin-books-page">
      <h1>Admin Books Page</h1>
      {!showForm && (
        <button
          className="btn btn-success mb-3"
          onClick={() => setShowForm(true)}
        >
          {' '}
          Add Book{' '}
        </button>
      )}

      {showForm && (
        <NewBookForm
          onSuccess={() => {
            setShowForm(false);
            fetchBooks(page, pageNum, false, []).then((data) =>
              setBooks(data.books)
            ); // Reload books after adding a new one
          }}
          onCancel={() => setShowForm(false)} // Corrected syntax
        />
      )}

      {editingBook && (
        <EditBookForm
          book={editingBook}
          onSuccess={() => {
            setEditingBook(null);
            fetchBooks(page, pageNum, false, []).then((data) => {
              console.log('Updated books:', data.books); // Debugging output
              setBooks(data.books);
            });
          }}
          onCancel={() => setEditingBook(null)}
        />
      )}

      <table className="book-table table-striped">
        <thead className="thead-dark">
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Classification</th>
            <th>Category</th>
            <th>Page Count</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.publisher}</td>
              <td>{book.isbn}</td>
              <td>{book.classification}</td>
              <td>{book.category}</td>
              <td>{book.pageCount}</td>
              <td>${book.price.toFixed(2)}</td>
              <td>
                {/* Add action buttons here */}
                <button
                  className="btn btn-primary btn-sm w-100 mb-1"
                  onClick={() => setEditingBook(book)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm w-100 mb-1"
                  onClick={() => handleDelete(book.title)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={pageNum}
        totalPages={totalPages}
        pageSize={page}
        onPageChange={setPageNum}
        onPageSizeChange={(newSize) => {
          setPage(newSize);
          setPageNum(1); // Reset page number when page size changes
        }}
      />
    </div>
  );
};

export default AdminBooksPage;
