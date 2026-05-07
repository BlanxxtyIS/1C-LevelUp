import { motion } from 'framer-motion'
import { Map, BookOpen, User, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface Props {
  onHome: () => void
  onLevelMap: () => void
  onCourses: () => void
  onProfile: () => void
  onAdmin: () => void
}

export default function HomePage({ onHome, onLevelMap, onCourses, onProfile, onAdmin }: Props) {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen px-6 py-8" style={{ background: '#0f0f1a' }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 py-2">
          <motion.h1
            className="text-3xl font-bold text-white cursor-pointer"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onHome}
          >
            1C <span className="text-violet-400">LevelUp</span>
          </motion.h1>
        </div>

        {/* Header */}
        <div className="flex items-center justify-end gap-2 py-2">
          <button
            onClick={onAdmin}
            className="text-xs text-slate-500 hover:text-violet-400 transition-colors px-3 py-1 rounded-lg border border-slate-800 hover:border-violet-800"
          >
            Admin
          </button>

          <button
            onClick={onProfile}
            className="w-9 h-9 rounded-full bg-violet-600/20 border border-violet-800 flex items-center justify-center text-violet-400 hover:bg-violet-600/40 transition-colors"
          >
            <User size={16} />
          </button>
          <button
            onClick={logout}
            className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-900 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>

        {/* XP Bar */}
        {user && (
          <motion.div
            className="rounded-2xl p-4 mb-8 border border-slate-800"
            style={{ background: '#1a1a2e' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span>⚡ Уровень {user.level}</span>
              <span>{user.totalXp} XP</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((user.totalXp / (user.level * 50)) * 100, 100)}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </motion.div>
        )}

        {/* Mode selection */}
        <p className="text-slate-500 text-xs uppercase tracking-wider mb-4 font-semibold">Выбери режим</p>

        <div className="flex flex-col gap-4">
          {/* Level Map */}
          <motion.button
            onClick={onLevelMap}
            className="w-full text-left rounded-2xl p-6 border border-violet-800/50 hover:border-violet-600 transition-colors"
            style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-violet-600/20 border border-violet-600/30 flex items-center justify-center">
                <Map size={28} className="text-violet-400" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Игровой режим</h2>
                <p className="text-slate-400 text-sm mt-0.5">Карта пути, XP, уровни</p>
                <p className="text-violet-400 text-xs mt-1.5">↗ Как Duolingo</p>
              </div>
            </div>
          </motion.button>

          {/* Courses */}
          <motion.button
            onClick={onCourses}
            className="w-full text-left rounded-2xl p-6 border border-emerald-800/50 hover:border-emerald-600 transition-colors"
            style={{ background: 'linear-gradient(135deg, #1a1a2e, #0d1f1a)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 border border-emerald-600/30 flex items-center justify-center">
                <BookOpen size={28} className="text-emerald-400" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Курсы</h2>
                <p className="text-slate-400 text-sm mt-0.5">Главы, темы, материалы</p>
                <p className="text-emerald-400 text-xs mt-1.5">↗ Как Яндекс Практикум</p>
              </div>
            </div>
          </motion.button>
        </div>

      </div>
    </div>
  )
}