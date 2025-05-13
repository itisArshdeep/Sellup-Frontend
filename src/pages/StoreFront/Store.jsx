import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { getStore } from '../../utils/api'
import ProductCard from '../../components/ProductCard'

export default function Store() {
  const { slug } = useParams()
  const [store, setStore] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const { store: storeData, products: productsData } = await getStore(slug)
        setStore(storeData)
        setProducts(productsData)
      } catch (error) {
        toast.error('Store not found')
      } finally {
        setLoading(false)
      }
    }
    fetchStore()
  }, [slug])

  if (loading) return <div>Loading...</div>
  if (!store) return <div>Store not found</div>

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">{store.storeName}</h1>
        {store.logo && (
          <img 
            src={store.logo} 
            alt={store.storeName} 
            className="w-32 h-32 mx-auto rounded-full object-cover my-4"
          />
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product._id} 
            product={product} 
            storeSlug={slug}
          />
        ))}
      </div>
    </div>
  )
}