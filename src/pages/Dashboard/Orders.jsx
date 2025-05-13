import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { getOrders, updateOrderStatus } from '../../utils/api';

const statusOptions = [
  'received',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'delivered',
  'cancelled'
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order._id === orderId ? updatedOrder : order
      ));
      toast.success('Status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-3 px-4 text-left">Customer</th>
              <th className="py-3 px-4 text-left">Amount</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {orders.map(order => (
              <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4">{order._id.slice(-6)}</td>
                <td className="py-3 px-4">
                  <div>{order.customerName}</div>
                  <div className="text-sm text-gray-500">{order.customerPhone}</div>
                </td>
                <td className="py-3 px-4">₹{order.totalAmount}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    order.orderStatus === 'delivered' ? 'bg-green-200 text-green-800' :
                    order.orderStatus === 'cancelled' ? 'bg-red-200 text-red-800' :
                    'bg-yellow-200 text-yellow-800'
                  }`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="border rounded p-1 text-sm"
                  >
                    {statusOptions.map(option => (
                      <option key={option} value={option}>
                        {option.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}