import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Dashboard from './pages/Dashboard/Products'
import AddProduct from './pages/Dashboard/AddProduct'
import Orders from './pages/Dashboard/Orders'
import OrderHistory from './pages/Dashboard/OrderHistory'
import Store from './pages/StoreFront/Store'
import Cart from './pages/StoreFront/Cart'
import Checkout from './pages/StoreFront/Checkout'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/add-product" element={<AddProduct />} />
            <Route path="/dashboard/orders" element={<Orders />} />
            <Route path="/dashboard/order-history" element={<OrderHistory />} />
            
            {/* Store Routes */}
            <Route path="/store/:slug" element={<Store />} />
            <Route path="/store/:slug/cart" element={<Cart />} />
            <Route path="/store/:slug/checkout" element={<Checkout />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App