import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Shield, Loader2 } from 'lucide-react'
import { adminGetUsers, adminUpdateUserRole, adminDeleteUser } from '../../api'
import { useAuth } from '../../context/AuthContext'

interface User {
  id: number
  name: string
  email: string
  role: string
  totalXp: number
  level: number
  completedLessons: number
}

const ROLES = ['Student', 'Teacher', 'Admin']

const roleConfig: Record<string, { color: string; bg: string }> = {
  Student: { color: 'text-slate-300', bg: 'bg-slate-700' },
  Teacher: { color: 'text-emerald-300', bg: 'bg-emerald-900/50' },
  Admin: { color: 'text-violet-300', bg: 'bg-violet-900/50' },
}

export default function UsersAdmin() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    setLoading(true)
    setUsers(await adminGetUsers())
    setLoading(false)
  }

  async function handleRoleChange(id: number, role: string) {
    await adminUpdateUserRole(id, role)
    await loadUsers()
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Удалить пользователя ${name}?`)) return
    await adminDeleteUser(id)
    await loadUsers()
  }

  if (loading) return (
    <div className="flex justify-center py-12">
      <Loader2 className="text-violet-400 animate-spin" size={32} />
    </div>
  )

  return (
    <div className="flex flex-col gap-3">
      {users.map((user, index) => {
        const config = roleConfig[user.role] ?? roleConfig.Student
        const isSelf = user.id === currentUser?.id

        return (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-2xl px-4 py-4 border border-slate-800"
            style={{ background: '#1a1a2e' }}
          >
            <div className="flex items-center gap-3">
              {/* Аватар */}
              <div className="w-10 h-10 rounded-full bg-violet-600/20 border border-violet-800 flex items-center justify-center text-violet-400 font-bold shrink-0">
                {user.name[0].toUpperCase()}
              </div>

              {/* Инфо */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white font-semibold text-sm">{user.name}</p>
                  {isSelf && <span className="text-xs text-slate-500">(вы)</span>}
                </div>
                <p className="text-slate-500 text-xs truncate">{user.email}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-yellow-500">⚡ {user.totalXp} XP</span>
                  <span className="text-xs text-slate-600">Ур. {user.level}</span>
                  <span className="text-xs text-slate-600">{user.completedLessons} уроков</span>
                </div>
              </div>

              {/* Роль + действия */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1">
                  <Shield size={12} className={config.color} />
                  <select
                    value={user.role}
                    onChange={e => handleRoleChange(user.id, e.target.value)}
                    disabled={isSelf}
                    className={`text-xs font-semibold px-2 py-1 rounded-lg border-0 outline-none cursor-pointer ${config.color} ${config.bg} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {ROLES.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => handleDelete(user.id, user.name)}
                  disabled={isSelf}
                  className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}