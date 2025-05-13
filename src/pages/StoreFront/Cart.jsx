import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';

export default function Cart() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem('cart')) || []
  );

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cart.map(item => 
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (productId) => {
    const updatedCart = cart.filter(item => item.productId !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + (item.price * item.quantity), 0
  );

  if (cart.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <button
          onClick={() => navigate(`/store/${slug}`)}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {cart.map((item) => (
            <div key={item.productId} className="flex justify-between items-center border-b py-4">
              <div className="flex items-center">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-16 h-16 object-cover rounded mr-4"
                />
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-600">₹{item.price}</p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="px-2 border rounded-l"
                >
                  -
                </button>
                <span className="px-4 border-t border-b">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="px-2 border rounded-r"
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="ml-4 text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₹{totalAmount}</span>
          </div>
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>
          
          <button
            onClick={() => navigate(`/store/${slug}/checkout`)}
            className="w-full mt-6 bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Proceed to Checkout (₹{totalAmount})
          </button>
        </div>
      </div>
    </div>
  );
}