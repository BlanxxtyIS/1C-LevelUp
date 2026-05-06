import { useState } from 'react'
import { useAuth } from './context/AuthContext'
import LevelMap from './components/LevelMap'
import AdminPanel from './components/admin/AdminPanel'
import AuthScreen from './components/AuthScreen'
import ProfileScreen from './components/ProfileScreen'

function App() {
  const { user, loading } = useAuth()
  const [page, setPage] = useState<'map' | 'admin' | 'profile'>('map')

  if (loading) return null
  if (!user) return <AuthScreen />

  if (page === 'admin') return <AdminPanel onBack={() => setPage('map')} />
  if (page === 'profile') return <ProfileScreen onBack={() => setPage('map')} />
  return <LevelMap onAdmin={() => setPage('admin')} onProfile={() => setPage('profile')} />
}

export default App