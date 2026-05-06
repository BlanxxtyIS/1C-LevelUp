import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Star, CheckCircle, Play, Loader2, User } from 'lucide-react'
import LessonScreen from './LessonScreen'
import { getLessons, saveProgress, getUserProfile } from '../api'
import { useAuth } from '../context/AuthContext'

type LessonStatus = 'completed' | 'active' | 'locked'

interface Lesson {
  id: number
  title: string
  xpReward: number
  status: LessonStatus
}

interface UserProfile {
  id: number
  username: string
  totalXp: number
  level: number
  completedLessons: number
}

interface Props {
  onAdmin: () => void
  onProfile: () => void
}

const statusConfig = {
  completed: {
    bg: 'bg-emerald-500',
    border: 'border-emerald-400',
    icon: CheckCircle,
    iconColor: 'text-white',
    glow: '0 0 20px rgba(52, 211, 153, 0.4)',
  },
  active: {
    bg: 'bg-violet-600',
    border: 'border-violet-400',
    icon: Play,
    iconColor: 'text-white',
    glow: '0 0 30px rgba(139, 92, 246, 0.6)',
  },
  locked: {
    bg: 'bg-slate-700',
    border: 'border-slate-600',
    icon: Lock,
    iconColor: 'text-slate-400',
    glow: 'none',
  },
}

function LessonNode({ lesson, index, onClick }: { lesson: Lesson; index: number; onClick: () => void }) {
  const config = statusConfig[lesson.status]
  const Icon = config.icon
  const isLeft = index % 2 === 0

  return (
    <motion.div
      className="flex items-center gap-6"
      style={{ justifyContent: isLeft ? 'flex-start' : 'flex-end' }}
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      {!isLeft && (
        <div className="text-right">
          <p className={`text-sm font-semibold ${lesson.status === 'locked' ? 'text-slate-500' : 'text-white'}`}>
            {lesson.title}
          </p>
          <p className="text-xs text-slate-500">+{lesson.xpReward} XP</p>
        </div>
      )}

      <div className="relative">
        {lesson.status === 'active' && (
          <motion.div
            className="absolute inset-0 rounded-full bg-violet-500 opacity-30"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        <motion.button
          className={`relative w-16 h-16 rounded-full border-2 ${config.bg} ${config.border} flex items-center justify-center`}
          style={{ boxShadow: config.glow }}
          whileHover={lesson.status !== 'locked' ? { scale: 1.1 } : {}}
          whileTap={lesson.status !== 'locked' ? { scale: 0.95 } : {}}
          onClick={onClick}
          disabled={lesson.status === 'locked'}
        >
          <Icon size={24} className={config.iconColor} />
        </motion.button>

        {lesson.status === 'completed' && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
            <Star size={10} className="text-yellow-900 fill-yellow-900" />
          </div>
        )}
      </div>

      {isLeft && (
        <div>
          <p className={`text-sm font-semibold ${lesson.status === 'locked' ? 'text-slate-500' : 'text-white'}`}>
            {lesson.title}
          </p>
          <p className="text-xs text-slate-500">+{lesson.xpReward} XP</p>
        </div>
      )}
    </motion.div>
  )
}

function Connector({ fromIndex }: { fromIndex: number }) {
  const isLeft = fromIndex % 2 === 0
  return (
    <div className="flex" style={{ justifyContent: isLeft ? 'flex-start' : 'flex-end' }}>
      <motion.div
        className="w-0.5 h-10 bg-gradient-to-b from-slate-500 to-slate-700 ml-8 mr-8"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: fromIndex * 0.1 + 0.2 }}
      />
    </div>
  )
}

export default function LevelMap({ onAdmin, onProfile }: Props) {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [user, setUser] = useState<UserProfile | null>(null)
  const [openLesson, setOpenLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)

  const { user: authUser, logout } = useAuth()

  useEffect(() => {
    if (!authUser) return
    async function init() {
      const [lessonsData, profileData] = await Promise.all([
        getLessons(authUser!.id),
        getUserProfile(authUser!.id)
      ])
      setUser(profileData)
      setLessons(lessonsData)
      setLoading(false)
    }
    init()
  }, [authUser])

  async function handleComplete(xpEarned: number) {
    if (!openLesson || !authUser) return
    await saveProgress(authUser.id, openLesson.id, xpEarned)

    const [lessonsData, profileData] = await Promise.all([
      getLessons(authUser.id),
      getUserProfile(authUser.id)
    ])
    setLessons(lessonsData)
    setUser(profileData)
    setOpenLesson(null)
  }

  const maxXp = user ? user.level * 50 : 50

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0f1a' }}>
        <Loader2 className="text-violet-400 animate-spin" size={40} />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#0f0f1a' }}>
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <motion.h1
            className="text-3xl font-bold text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            1C <span className="text-violet-400">LevelUp</span>
          </motion.h1>

          <div className="flex items-center gap-2">
            <button
              onClick={onProfile}
              className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-800 flex items-center justify-center text-violet-400 hover:bg-violet-600/40 transition-colors"
              title={authUser?.username}
            >
              <User size={16} />
            </button>
            <button
              onClick={onAdmin}
              className="text-xs text-slate-500 hover:text-violet-400 transition-colors px-3 py-1 rounded-lg border border-slate-800 hover:border-violet-800"
            >
              Admin
            </button>
            <button
              onClick={logout}
              className="text-xs text-slate-500 hover:text-red-400 transition-colors px-3 py-1 rounded-lg border border-slate-800 hover:border-red-900"
            >
              Выйти
            </button>
          </div>
        </div>

        {user && (
          <motion.div className="mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Уровень {user.level} · {user.username}</span>
              <span>{user.totalXp} / {maxXp} XP</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full"
                animate={{ width: `${Math.min((user.totalXp / maxXp) * 100, 100)}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
            <p className="text-xs text-slate-600 mt-1">Пройдено уроков: {user.completedLessons}</p>
          </motion.div>
        )}
      </div>

      <div className="px-8 py-6 max-w-sm mx-auto">
        {lessons.map((lesson, index) => (
          <div key={lesson.id}>
            <LessonNode
              lesson={lesson}
              index={index}
              onClick={() => lesson.status === 'active' && setOpenLesson(lesson)}
            />
            {index < lessons.length - 1 && <Connector fromIndex={index} />}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {openLesson && (
          <LessonScreen
            lessonId={openLesson.id}
            onClose={() => setOpenLesson(null)}
            onComplete={handleComplete}
          />
        )}
      </AnimatePresence>
    </div>
  )
}