import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalBooksdata, setTotalBooksdata] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isSorted, setIsSorted] = useState<boolean>(false);
  const navigate = useNavigate();
  const { cart, addToCart } = useCart(); // Access both cart state and the addToCart function

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
    const fetchBooks = async () => {
      const categoryParams = selectedCategories
        .map((c) => `category=${encodeURIComponent(c)}`)
        .join('&');

      const response = await fetch(
        `https://localhost:5000/api/Bookstore?pageSize=${page}&pageNum=${pageNum}&isSorted=${isSorted}${
          selectedCategories.length ? `&${categoryParams}` : ''
        }`
      );
      const data = await response.json();
      setBooks(data.something);
      setTotalBooksdata(data.totalNumBooks);
      setTotalPages(Math.ceil(data.totalNumBooks / page));
    };

    fetchBooks();
  }, [page, pageNum, isSorted, selectedCategories]);

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

      {books.map((b) => (
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
      ))}

      {/* Pagination */}
      <button disabled={pageNum === 1} onClick={() => setPageNum(pageNum - 1)}>
        Previous
      </button>
      {[...Array(totalPages).keys()].map((_, p) => (
        <button
          key={p + 1}
          onClick={() => setPageNum(p + 1)}
          disabled={pageNum === p + 1}
        >
          {p + 1}
        </button>
      ))}
      <button
        disabled={pageNum === totalPages}
        onClick={() => setPageNum(pageNum + 1)}
      >
        Next
      </button>

      <br />
      <label>
        Results per page:
        <select
          value={page}
          onChange={(p) => {
            setPage(Number(p.target.value));
            setPageNum(1);
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </label>
    </>
  );
}

export default BookList;
