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
  const isPremium = user?.isPremium ?? false

  function handleLevelMap() {
    if (isLocked) { setShowPremium(true); return }
    onLevelMap()
  }

  function handleCourses() {
    if (isLocked) { setShowPremium(true); return }
    onCourses()
  }

  return (
    <div className="min-h-screen px-6 py-8 relative overflow-hidden" style={{ background: '#0f0f1a' }}>
      <StarField />

      {/* Премиум фоновое свечение */}
      {isPremium && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
          style={{ boxShadow: 'inset 0 0 30px rgba(124,58,237,0.6), 0 0 20px rgba(124,58,237,0.4)' }}
        />
      )}

      <div className="max-w-2xl mx-auto relative" style={{ zIndex: 1 }}>

        {/* Header */}
        <div className="flex items-center justify-between py-2 mb-6">
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-white cursor-pointer" onClick={onHome}>
                1C <span className="text-violet-400">LevelUp</span>
              </h1>
              {isPremium && (
                <motion.span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white' }}
                  animate={{ boxShadow: ['0 0 8px rgba(168,85,247,0.6)', '0 0 20px rgba(168,85,247,0.9)', '0 0 8px rgba(168,85,247,0.6)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  PRO ✨
                </motion.span>
              )}
            </div>
          </motion.div>

          <div className="flex items-center gap-2">
            {(user?.role === 'Admin' || user?.role === 'Teacher') && (
              <button
                onClick={onAdmin}
                className="text-xs text-slate-500 hover:text-violet-400 transition-colors px-3 py-1 rounded-lg border border-slate-800 hover:border-violet-800"
              >
                Admin
              </button>
            )}
            <button onClick={onProfile} className="relative">
              {/* Премиум аватарка */}
              {isPremium ? (
                <motion.div
                  className="rounded-full p-0.5"
                  animate={{ boxShadow: ['0 0 8px rgba(168,85,247,0.8)', '0 0 20px rgba(168,85,247,1)', '0 0 8px rgba(168,85,247,0.8)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)' }}
                >
                  <div className="rounded-full overflow-hidden border-2 border-transparent" style={{ width: 36, height: 36 }}>
                    <Avatar name={user?.name ?? 'U'} avatarUrl={user?.avatarUrl} size={36} />
                  </div>
                </motion.div>
              ) : (
                <div className="w-9 h-9 rounded-full overflow-hidden border border-violet-800 hover:border-violet-600 transition-colors">
                  <Avatar name={user?.name ?? 'U'} avatarUrl={user?.avatarUrl} size={36} />
                </div>
              )}
              {isPremium && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-xs">
                  👑
                </div>
              )}
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
            className="rounded-2xl p-4 mb-6 border"
            style={{
              background: '#1a1a2e',
              borderColor: isPremium ? 'rgba(124,58,237,0.5)' : 'rgba(51,65,85,1)'
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span>⚡ Уровень {user.level}</span>
              <span>
                {user.totalXp} XP
                {isLocked && <span className="text-violet-400 ml-1">· Нужна подписка 👑</span>}
                {isPremium && <span className="text-violet-400 ml-1">· Pro активен ✨</span>}
              </span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: isPremium ? 'linear-gradient(90deg, #7c3aed, #a855f7, #ec4899)' : 'linear-gradient(90deg, #7c3aed, #818cf8)' }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((user.totalXp / (user.level * 50)) * 100, 100)}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
            {!user.isPremium && user.totalXp <= 100 && (
              <p className="text-xs text-slate-500 mt-1">Бесплатно ещё {100 - user.totalXp} XP</p>
            )}
          </motion.div>
        )}

        <p className="text-slate-500 text-xs uppercase tracking-wider mb-4 font-semibold">Выбери режим</p>

        <div className="flex flex-col gap-4">
          {/* Level Map */}
          <motion.button
            onClick={handleLevelMap}
            className="w-full text-left rounded-2xl p-6 border transition-colors relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
              borderColor: isPremium ? 'rgba(124,58,237,0.6)' : isLocked ? 'rgba(51,65,85,0.5)' : 'rgba(109,40,217,0.5)'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Премиум анимированная рамка */}
            {isPremium && (
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                style={{ boxShadow: 'inset 0 0 20px rgba(124,58,237,0.3)' }}
              />
            )}
            {isLocked && <div className="absolute top-3 right-3 text-lg">🔒</div>}
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
            className="w-full text-left rounded-2xl p-6 border transition-colors relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #1a1a2e, #0d1f1a)',
              borderColor: isPremium ? 'rgba(16,185,129,0.6)' : isLocked ? 'rgba(51,65,85,0.5)' : 'rgba(6,95,70,0.5)'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isPremium && (
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
                style={{ boxShadow: 'inset 0 0 20px rgba(16,185,129,0.3)' }}
              />
            )}
            {isLocked && <div className="absolute top-3 right-3 text-lg">🔒</div>}
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