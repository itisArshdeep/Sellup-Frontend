import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

 const API_URL = 'http://localhost:5000/api';

export default function ProductDashboard({ product }) {
  const navigate = useNavigate();

  const handleUpdate = () => {
    navigate(`/dashboard/edit-product/${product._id}`);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/dashboard/products/${product._id}`, {
        headers: {
          'x-auth-token': token
        }
      });
      toast.success('Product deleted');
      window.location.reload(); // Or refetch products in parent
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error(error.response?.data?.error || 'Failed to delete product');
    }
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
        <div className="flex gap-2">
          <button 
            onClick={handleDelete} 
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
