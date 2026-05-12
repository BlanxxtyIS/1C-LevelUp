import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Star, Zap, BookOpen, Loader2, Flame, Camera, ChevronDown, ChevronUp } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getUserProfile, getStreakAndAchievements, getAllAchievements, updateAvatar } from '../api'
import Avatar from './Avatar'
import StarField from './StarField'

interface Props {
  onBack: () => void
}

interface FullProfile {
  id: number
  name: string
  email: string
  totalXp: number
  level: number
  completedLessons: number
  avatarUrl?: string | null
}

interface Achievement {
  key: string
  title: string
  description: string
  emoji: string
  isEarned: boolean
}

interface StreakData {
  currentStreak: number
  maxStreak: number
}

export default function ProfileScreen({ onBack }: Props) {
  const { user: authUser, login, token, logout } = useAuth()
  const [profile, setProfile] = useState<FullProfile | null>(null)
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [achievementsOpen, setAchievementsOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!authUser) return
    async function init() {
      const [profileData, streakRes, achievementsRes] = await Promise.all([
        getUserProfile(authUser!.id),
        getStreakAndAchievements(authUser!.id),
        getAllAchievements(authUser!.id)
      ])
      setProfile(profileData)
      setStreakData(streakRes)
      setAchievements(achievementsRes)
      setLoading(false)
    }
    init()
  }, [authUser])

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !authUser) return
    if (file.size > 2_000_000) { alert('Файл слишком большой. Максимум 2MB.'); return }
    setUploading(true)
    const reader = new FileReader()
    reader.onload = async () => {
      const base64 = reader.result as string
      await updateAvatar(authUser.id, base64)
      setProfile(prev => prev ? { ...prev, avatarUrl: base64 } : prev)
      if (authUser && token) login(token, { ...authUser, avatarUrl: base64 })
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0f1a' }}>
      <Loader2 className="text-violet-400 animate-spin" size={40} />
    </div>
  )

  if (!profile) return null

  const earnedCount = achievements.filter(a => a.isEarned).length

  return (
    <div className="min-h-screen relative" style={{ background: '#0f0f1a' }}>
      <StarField />
      <div className="relative px-6 pt-8 pb-8" style={{ zIndex: 1 }}>
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-white">Профиль</h1>
          </div>

          {/* Avatar + name */}
          <motion.div
            className="flex flex-col items-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="relative mb-4">
              <Avatar name={profile.name} avatarUrl={profile.avatarUrl} size={80} />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-violet-600 hover:bg-violet-500 flex items-center justify-center transition-colors"
              >
                {uploading
                  ? <Loader2 size={12} className="text-white animate-spin" />
                  : <Camera size={12} className="text-white" />
                }
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
            <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
            <p className="text-slate-500 text-sm mt-1">{profile.email}</p>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-4 gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {[
              { icon: Star, label: 'Уровень', value: profile.level, color: 'text-yellow-400' },
              { icon: Zap, label: 'XP', value: profile.totalXp, color: 'text-violet-400' },
              { icon: BookOpen, label: 'Уроков', value: profile.completedLessons, color: 'text-emerald-400' },
              { icon: Flame, label: 'Стрик', value: streakData?.currentStreak ?? 0, color: 'text-orange-400' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="rounded-2xl p-4 text-center" style={{ background: '#1a1a2e' }}>
                <Icon size={20} className={`${color} mx-auto mb-2`} />
                <p className={`text-xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-slate-500 mt-1">{label}</p>
              </div>
            ))}
          </motion.div>

          {/* Streak info */}
          {(streakData?.currentStreak ?? 0) > 0 && (
            <motion.div
              className="rounded-2xl p-4 mb-6 border border-orange-900/30"
              style={{ background: 'rgba(251,146,60,0.05)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame size={20} className="text-orange-400" />
                  <div>
                    <p className="text-white font-semibold text-sm">{streakData?.currentStreak} дней подряд!</p>
                    <p className="text-slate-500 text-xs">Рекорд: {streakData?.maxStreak} дней</p>
                  </div>
                </div>
                <span className="text-3xl">🔥</span>
              </div>
            </motion.div>
          )}

          {/* XP bar */}
          <motion.div
            className="rounded-2xl p-4 mb-6"
            style={{ background: '#1a1a2e' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span>Прогресс уровня {profile.level}</span>
              <span>{profile.totalXp} / {profile.level * 50} XP</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((profile.totalXp / (profile.level * 50)) * 100, 100)}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </div>
          </motion.div>

          {/* Achievements — сворачиваемые */}
          <motion.div
            className="rounded-2xl border border-slate-800 overflow-hidden mb-6"
            style={{ background: '#1a1a2e' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <button
              onClick={() => setAchievementsOpen(p => !p)}
              className="w-full flex items-center justify-between px-4 py-4 hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-white font-bold">Достижения</span>
                <span className="text-xs text-violet-400 bg-violet-900/30 px-2 py-0.5 rounded-full">
                  {earnedCount}/{achievements.length}
                </span>
              </div>
              {achievementsOpen
                ? <ChevronUp size={16} className="text-slate-400" />
                : <ChevronDown size={16} className="text-slate-400" />
              }
            </button>

            <AnimatePresence>
              {achievementsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-2 p-4 pt-0">
                    {achievements.map((a, i) => (
                      <motion.div
                        key={a.key}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className={`rounded-2xl p-3 border ${
                          a.isEarned ? 'border-violet-800/50' : 'border-slate-700 opacity-40'
                        }`}
                        style={{ background: a.isEarned ? 'rgba(124,58,237,0.08)' : '#0f0f1a' }}
                      >
                        <div className="text-2xl mb-1">{a.emoji}</div>
                        <p className={`text-xs font-semibold ${a.isEarned ? 'text-white' : 'text-slate-500'}`}>
                          {a.title}
                        </p>
                        <p className="text-xs text-slate-600 mt-0.5">{a.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Logout */}
          <motion.button
            className="w-full py-3 rounded-xl border border-red-900 text-red-400 hover:bg-red-900/20 transition-colors text-sm font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={logout}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Выйти из аккаунта
          </motion.button>

        </div>
      </div>
    </div>
  )
}