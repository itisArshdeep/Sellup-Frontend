import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { createOrder } from '../../utils/api';
import UPIQRCode from '../../components/UPIQRCode';

export default function Checkout() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    notes: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    address: '',
    phone: ''
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: '',
      address: '',
      phone: ''
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
      valid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      valid = false;
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number (10 digits required)';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill all required fields correctly');
      return;
    }

    try {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      if (cart.length === 0) {
        toast.error('Your cart is empty');
        return;
      }

      const orderData = {
        customerName: formData.name,
        customerAddress: formData.address,
        customerPhone: formData.phone,
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      };

      const response = await createOrder(slug, orderData);
      setOrder(response.order);
      localStorage.removeItem('cart');
      toast.success('Order placed successfully!');

      if (response.paymentLink) {
        window.location.href = response.paymentLink;
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Checkout failed. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (order) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Order Confirmed!</h2>
        <UPIQRCode 
          upiId={order.storeOwner.upiId} 
          amount={order.totalAmount}
          note={`Order ${order._id}`}
        />
        <button
          onClick={() => navigate(`/store/${slug}`)}
          className="mt-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Back to Store
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label className="block mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : ''}`}
            required
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-2">
            Delivery Address <span className="text-red-500">*</span>
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.address ? 'border-red-500' : ''}`}
            rows="3"
            required
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.phone ? 'border-red-500' : ''}`}
            required
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div className="mb-6">
          <label className="block mb-2">Delivery Notes (Optional)</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Place Order
        </button>
      </form>
    </div>
  );
}