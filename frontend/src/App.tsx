import { useState } from 'react'
import LevelMap from './components/LevelMap'
import AdminPanel from './components/admin/AdminPanel'

function App() {
  const [page, setPage] = useState<'map' | 'admin'>('map')

  if (page === 'admin') return <AdminPanel onBack={() => setPage('map')} />
  return <LevelMap onAdmin={() => setPage('admin')} />
}

export default App