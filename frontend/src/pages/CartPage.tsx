/* import { useNavigate, useParams } from 'react-router-dom';
import WelcomeBanner from '../components/WelcomeBanner';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

function CartPage() {
  const navigate = useNavigate();
  const { title, bookID } = useParams();
  const {addToCart} = useCart();
  const [donationAmount, setDonationAmount] = useState<number>(0);

  const handleAddToCart = () =>{
    const newItem: CartItem = {
        title,
        quantity,
        price}
        addToCart(newItem);
        navigate('/CartPage');
    }
  }
  return (
    <>
      <WelcomeBanner />
      <h5>Added Book: {title}</h5>
      <h5>Quantity:</h5>
      <h5>Price:</h5>
      <h5>Subtotal:</h5>

      <h2>Cart Total</h2>
      <h5>Total</h5>
      <button onClick={() => navigate('/')}> Continue Shopping</button>
    </>
  );
}

export default CartPage;

 */

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
    <>
      <WelcomeBanner />
      <h2>Cart Summary</h2>
      <ul>
        {cart.map((item, index) => (
          <li key={index}>
            {item.title} - {item.quantity} x ${item.price} = $
            {item.subtotal.toFixed(2)}
            <button onClick={() => removeItem(item.bookID)}>Remove</button>
          </li>
        ))}
      </ul>

      <div>
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Total: ${total.toFixed(2)}</p>
      </div>

      <button onClick={() => navigate('/')}>Continue Shopping</button>
    </>
  );
}

export default CartPage;
