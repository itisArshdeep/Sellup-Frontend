import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function Footer() {
  const { user } = useAuth()

  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-center space-x-8 mb-4">
          {user && (
            <>
              <Link to="/dashboard" className="hover:text-blue-400">
                Products
              </Link>
              <Link to="/dashboard/orders" className="hover:text-blue-400">
                Orders
              </Link>
              <Link to="/dashboard/order-history" className="hover:text-blue-400">
                History
              </Link>
            </>
          )}
        </div>
        <p className="text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} MyStoreApp. All rights reserved.
        </p>
      </div>
    </footer>
  )
}