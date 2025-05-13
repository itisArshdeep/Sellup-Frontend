import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product, storeSlug }) {
  const navigate = useNavigate();

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => item.productId === product._id);
    
    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    navigate(`/store/${storeSlug}/cart`); // Redirect to cart page
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow">
      <img 
        src={product.imageUrl} 
        alt={product.name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-gray-600 mb-2">₹{product.price}</p>
        <button
          onClick={addToCart}
          className="w-full bg-green-600 text-white py-1 rounded hover:bg-green-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}