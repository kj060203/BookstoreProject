import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { fetchBooks } from '../api/BooksAPI';
import Pagination from './Pagination';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalBooksdata, setTotalBooksdata] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isSorted, setIsSorted] = useState<boolean>(false);
  const navigate = useNavigate();
  const { cart, addToCart } = useCart(); // Access both cart state and the addToCart function
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Calculate cart summary
  const totalItems = Object.values(cart).reduce(
    (sum, item) => sum + (item ? item.quantity : 0),
    0
  );
  const totalPrice = Object.values(cart).reduce(
    (sum, item) => sum + (item ? item.quantity * item.price : 0),
    0
  );
  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const data = await fetchBooks(
          page,
          pageNum,
          isSorted,
          selectedCategories
        );

        console.log('Fetched Data:', data); // Debugging output

        if (!data || !data.books) {
          console.error('API Response Structure:', data); // Log the response structure
          throw new Error('Invalid data format from API');
        }

        setBooks(data.books);
        setTotalBooksdata(data.totalNumBooks);
        setTotalPages(Math.ceil(data.totalNumBooks / page));
      } catch (error) {
        console.error(error);
        setError('Failed to fetch books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [page, pageNum, isSorted, selectedCategories]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <button onClick={() => setIsSorted(!isSorted)}>
        {isSorted ? 'Unsorted' : 'Sorted'}
      </button>

      {/* Cart Summary */}
      <div className="cart-summary">
        <h3>Cart Summary</h3>
        <p>
          {totalItems} items - ${totalPrice.toFixed(2)}
        </p>
        <button onClick={() => navigate('/CartPage')}>View Cart</button>
      </div>

      {books?.length > 0 ? (
        books.map((b) => (
          <div id="bookCard" className="card shadow" key={b.bookID}>
            <h3>{b.title}</h3>
            <div className="card-body">
              <ul className="list-unstyled">
                <li>
                  <strong>Author:</strong> {b.author}
                </li>
                <li>
                  <strong>Publisher:</strong> {b.publisher}
                </li>
                <li>
                  <strong>ISBN:</strong> {b.isbn}
                </li>
                <li>
                  <strong>Classification:</strong> {b.classification}
                </li>
                <li>
                  <strong>Category:</strong> {b.category}
                </li>
                <li>
                  <strong>Page Count:</strong> {b.pageCount}
                </li>
                <li>
                  <strong>Price:</strong> ${b.price}
                </li>
              </ul>
              <button className="btn btn-success" onClick={() => addToCart(b)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No books found.</p>
      )}
      <Pagination
        currentPage={pageNum}
        totalPages={totalPages}
        pageSize={page}
        onPageChange={setPageNum}
        onPageSizeChange={(newSize) => {
          setPage(newSize);
          setPageNum(1);
        }}
      />
    </>
  );
}

export default BookList;
