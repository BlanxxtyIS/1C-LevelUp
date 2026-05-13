import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Star, CheckCircle, Play, Loader2, User } from 'lucide-react'
import LessonScreen from './LessonScreen'
import { getLessons, saveProgress, getUserProfile, updateActivity } from '../api'
import { useAuth } from '../context/AuthContext'
import AchievementToast from './AchivementToast'

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
  onProfile: () => void
  onHome: () => void
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

function Connector({ fromIndex, status }: { fromIndex: number; status: LessonStatus }) {
  const isLeft = fromIndex % 2 === 0
  const isCompleted = status === 'completed'

  // Змейка идёт влево если узел слева, вправо если справа
  const width = 80
  const height = 80

  // Точки кривой Безье — создают плавный изгиб
  const path = isLeft
    ? `M 32 0 C 32 40, 48 40, 48 80`
    : `M 48 0 C 48 40, 32 40, 32 80`

  return (
    <div className="flex justify-center" style={{ height }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 80 80`}
        fill="none"
      >
        {/* Фоновая линия (серая) */}
        <motion.path
          d={path}
          stroke="#334155"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="6 6"
          fill="none"
        />

        {/* Линия прогресса (цветная) поверх */}
        {isCompleted && (
          <motion.path
            d={path}
            stroke="#10b981"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: fromIndex * 0.1 }}
          />
        )}
      </svg>
    </div>
  )
}

export default function LevelMap({ onProfile, onHome }: Props) {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [user, setUser] = useState<UserProfile | null>(null)
  const [openLesson, setOpenLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [newAchievements, setNewAchievements] = useState<{ key: string; title: string; emoji: string }[]>([])

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
    const activityResult = await updateActivity(authUser.id)

    // Показываем новые достижения
    if (activityResult.newAchievements?.length > 0) {
      setNewAchievements(activityResult.newAchievements)
    }

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
    <div className="px-6 pt-8 pb-4" style={{ background: '#0f0f1a' }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <motion.h1
            className="text-3xl font-bold text-white cursor-pointer"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onHome}
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
            {index < lessons.length - 1 &&
              <Connector fromIndex={index} status={lesson.status} />}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {openLesson && (
          <LessonScreen
            lessonId={openLesson.id}
            xpReward={openLesson.xpReward}
            onClose={() => setOpenLesson(null)}
            onComplete={handleComplete}
          />
        )}
      </AnimatePresence>
      <AchievementToast
        achievements={newAchievements}
        onDismiss={() => setNewAchievements([])}
      />
    </div>
  )
}