import { useNavigate } from 'react-router-dom';
import WelcomeBanner from '../components/WelcomeBanner';
import { useCart } from '../context/CartContext';

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeItem } = useCart();

  const calculateTotal = () => {
    let subtotal = 0;
    cart.forEach((item) => {
      item.subtotal = item.quantity * item.price;
      subtotal += item.subtotal;
    });
    const total = subtotal;
    return { subtotal, total };
  };

  const { subtotal, total } = calculateTotal();

  return (
    <div className="container">
      <WelcomeBanner />
      <div className="row">
        <div className="mt-4 col-md-12 text-center">
          {' '}
          {/* Center the content */}
          <h2>Cart Summary</h2>
          <p className="text-center">Subtotal: ${subtotal.toFixed(2)}</p>{' '}
          {/* Center text within the paragraph */}
          <p className="text-center">Total: ${total.toFixed(2)}</p>{' '}
          {/* Center text within the paragraph */}
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Continue Shopping
          </button>
        </div>
      </div>

      {cart.length > 0 && (
        <div className="mt-4">
          <h3>Items in Your Cart</h3>
          <ul className="list-group">
            {cart.map((item, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  {item.title} - {item.quantity} x ${item.price} = $
                  {item.subtotal.toFixed(2)}
                </div>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => removeItem(item.bookID)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {cart.length === 0 && (
        <div className="mt-4">
          <p className="alert alert-info">Your cart is currently empty.</p>
        </div>
      )}
    </div>
  );
}

export default CartPage;
