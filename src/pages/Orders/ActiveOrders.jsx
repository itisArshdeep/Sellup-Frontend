import { useEffect, useState } from 'react';
import { fetchOrders, updateOrderStatus } from '../../routes/orderRoutes';

export default function ActiveOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      const data = await fetchOrders('active');
      setOrders(data);
    };
    loadOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    setOrders(orders.filter(order => order._id !== orderId)); // Remove completed orders
  };

  return (
    <div>
      <h2>Active Orders</h2>
      {/* Render your orders table */}
    </div>
  );
}