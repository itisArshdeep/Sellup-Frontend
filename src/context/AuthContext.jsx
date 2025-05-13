import { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginApi, registerApi, getCurrentUser } from '../utils/api'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const userData = await getCurrentUser()
          setUser(userData)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const login = async (email, password) => {
    const { token, owner } = await loginApi(email, password)
    localStorage.setItem('token', token)
    setUser(owner)
    navigate('/dashboard')
  }

  const register = async (email, password, storeName, upiId) => {
    const { token, owner } = await registerApi(email, password, storeName, upiId)
    localStorage.setItem('token', token)
    setUser(owner)
    navigate('/dashboard')
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}