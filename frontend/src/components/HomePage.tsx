import { useState } from 'react'
import { motion } from 'framer-motion'
import { Map, BookOpen, Trophy, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import StarField from './StarField'
import PremiumModal from './PremiumModal'
import Avatar from './Avatar'

interface Props {
  onHome: () => void
  onLevelMap: () => void
  onCourses: () => void
  onProfile: () => void
  onAdmin: () => void
  onLeaderboard: () => void
  onLegal: () => void
}

export default function HomePage({ onHome, onLevelMap, onCourses, onProfile, onAdmin, onLeaderboard, onLegal }: Props) {
  const { user, logout } = useAuth()
  const [showPremium, setShowPremium] = useState(false)

  const isLocked = (user?.totalXp ?? 0) > 100 && !user?.isPremium

  function handleLevelMap() {
    if (isLocked) { setShowPremium(true); return }
    onLevelMap()
  }

  function handleCourses() {
    if (isLocked) { setShowPremium(true); return }
    onCourses()
  }

  return (
    <div className="min-h-screen px-6 py-8 relative" style={{ background: '#0f0f1a' }}>
      <StarField />
      <div className="max-w-2xl mx-auto relative" style={{ zIndex: 1 }}>

        {/* Header */}
        <div className="flex items-center justify-between py-2 mb-6">
          <motion.h1
            className="text-3xl font-bold text-white cursor-pointer"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onHome}
          >
            1C <span className="text-violet-400">LevelUp</span>
          </motion.h1>

          <div className="flex items-center gap-2">
            {(user?.role === 'Admin' || user?.role === 'Teacher') && (
              <button
                onClick={onAdmin}
                className="text-xs text-slate-500 hover:text-violet-400 transition-colors px-3 py-1 rounded-lg border border-slate-800 hover:border-violet-800"
              >
                Admin
              </button>
            )}
            <button
              onClick={onProfile}
              className="w-9 h-9 rounded-full overflow-hidden border border-violet-800 hover:border-violet-600 transition-colors"
            >
              <Avatar name={user?.name ?? 'U'} avatarUrl={user?.avatarUrl} size={36} />
            </button>
            <button
              onClick={logout}
              className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-900 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* XP Bar */}
        {user && (
          <motion.div
            className="rounded-2xl p-4 mb-6 border border-slate-800"
            style={{ background: '#1a1a2e' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span>⚡ Уровень {user.level}</span>
              <span>{user.totalXp} XP {isLocked && <span className="text-violet-400 ml-1">· Нужна подписка 👑</span>}</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((user.totalXp / (user.level * 50)) * 100, 100)}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
            {/* Прогресс до бесплатного лимита */}
            {!user.isPremium && user.totalXp <= 100 && (
              <p className="text-xs text-slate-500 mt-1">
                Бесплатно ещё {100 - user.totalXp} XP
              </p>
            )}
          </motion.div>
        )}

        {/* Mode selection */}
        <p className="text-slate-500 text-xs uppercase tracking-wider mb-4 font-semibold">Выбери режим</p>

        <div className="flex flex-col gap-4">
          {/* Level Map */}
          <motion.button
            onClick={handleLevelMap}
            className={`w-full text-left rounded-2xl p-6 border transition-colors relative ${isLocked
              ? 'border-slate-700/50 opacity-75'
              : 'border-violet-800/50 hover:border-violet-600'
              }`}
            style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLocked && (
              <div className="absolute top-3 right-3 text-lg">🔒</div>
            )}
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
            onClick={handleCourses}
            className={`w-full text-left rounded-2xl p-6 border transition-colors relative ${isLocked
              ? 'border-slate-700/50 opacity-75'
              : 'border-emerald-800/50 hover:border-emerald-600'
              }`}
            style={{ background: 'linear-gradient(135deg, #1a1a2e, #0d1f1a)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLocked && (
              <div className="absolute top-3 right-3 text-lg">🔒</div>
            )}
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

          {/* Leaderboard */}
          <motion.button
            onClick={onLeaderboard}
            className="w-full text-left rounded-2xl p-6 border border-yellow-800/50 hover:border-yellow-600 transition-colors"
            style={{ background: 'linear-gradient(135deg, #1a1a2e, #1f1a0d)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-yellow-600/20 border border-yellow-600/30 flex items-center justify-center">
                <Trophy size={28} className="text-yellow-400" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Лидеры</h2>
                <p className="text-slate-400 text-sm mt-0.5">Топ игроков по XP</p>
                <p className="text-yellow-400 text-xs mt-1.5">↗ Соревнуйся с другими</p>
              </div>
            </div>
          </motion.button>
        </div>
        <div className="text-center mt-8">
          <button
            onClick={onLegal}
            className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
          >
            Оферта · Реквизиты · Политика конфиденциальности
          </button>
        </div>
      </div>

      {showPremium && <PremiumModal onClose={() => setShowPremium(false)} onLegal={onLegal} />}
    </div>
  )
}