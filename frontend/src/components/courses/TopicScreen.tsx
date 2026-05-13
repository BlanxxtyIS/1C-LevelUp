import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Zap, Loader2, CheckCircle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { getTopicLessons, saveTopicLessonProgress, getCompletedLessons, updateActivity } from '../../api'
import AchievementToast from '../AchivementToast'
import { useAuth } from '../../context/AuthContext'
import StarField from '../StarField'
import PremiumGlow from '../PremiumGlow'
import PremiumBadge from '../PremiumBadge'

interface Topic {
  id: number
  title: string
  description: string
}

interface Course {
  emoji: string
  color: string
  title: string
}

interface Lesson {
  id: number
  title: string
  content: string
  xpReward: number
  durationMinutes: number
}

interface Props {
  topic: Topic
  course: Course
  onBack: () => void
}

export default function TopicScreen({ topic, course, onBack }: Props) {
  const { user, refreshUser } = useAuth()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [completedIds, setCompletedIds] = useState<number[]>([])
  const [saving, setSaving] = useState(false)
  const [allDone, setAllDone] = useState(false)
  const [newAchievements, setNewAchievements] = useState<{ key: string; title: string; emoji: string }[]>([])

  useEffect(() => {
    async function init() {
      const [lessonsData, completedData] = await Promise.all([
        getTopicLessons(topic.id),
        user ? getCompletedLessons(user.id) : Promise.resolve([])
      ])
      setLessons(lessonsData)
      setCompletedIds(completedData)
      setLoading(false)
    }
    init()
  }, [topic.id, user])

  useEffect(() => {
    if (lessons.length > 0 && lessons.every(l => completedIds.includes(l.id))) {
      setAllDone(true)
    }
  }, [completedIds, lessons])

  async function handleComplete() {
    if (!user || saving) return
    setSaving(true)

    const unfinished = lessons.filter(l => !completedIds.includes(l.id))
    for (const lesson of unfinished) {
      await saveTopicLessonProgress(user.id, lesson.id, lesson.xpReward)
    }
    const activityResult = await updateActivity(user.id)
    if (activityResult.newAchievements?.length > 0) {
      setNewAchievements(activityResult.newAchievements)
    }

    const updated = await getCompletedLessons(user.id)
    setCompletedIds(updated)
    setSaving(false)

    // Если нет новых достижений — сразу назад
    if (!activityResult.newAchievements?.length) {
      await refreshUser()
      onBack()
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0f1a' }}>
      <Loader2 className="text-violet-400 animate-spin" size={40} />
    </div>
  )

  const totalXp = lessons
    .filter(l => !completedIds.includes(l.id))
    .reduce((sum, l) => sum + l.xpReward, 0)

  return (
    <div className="min-h-screen relative" style={{ background: '#0f0f1a' }}>
      <StarField />
      <PremiumGlow />

      {/* Header */}
      <div className="px-6 pt-8 pb-2">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors shrink-0">
            <ArrowLeft size={20} />
          </button>

          <div className="flex-1 min-w-0">
            <p className="text-slate-500 text-xs">{course.emoji} {course.title}</p>
            <h1 className="text-xl font-bold text-white truncate">{topic.title}</h1>
          </div>
          
          <div className="flex items-center gap-3 text-xs text-slate-500 shrink-0">
            <span className="flex items-center gap-1">
              <Clock size={12} /> {lessons.reduce((sum, l) => sum + (l.durationMinutes ?? 5), 0)} мин
            </span>
            {totalXp > 0 && (
              <span className="flex items-center gap-1">
                <Zap size={12} className="text-yellow-400" /> +{totalXp} XP
              </span>
            )}
            {allDone && (
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle size={12} /> Пройдено
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative px-5 py-6 max-w-2xl mx-auto pb-24" style={{ zIndex: 1 }}>
        {lessons.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📭</p>
            <p className="text-slate-400">Контент ещё не добавлен</p>
            <p className="text-slate-600 text-sm mt-1">Загляни позже!</p>
          </div>
        ) : (
          lessons.map((lesson, index) => {
            const isCompleted = completedIds.includes(lesson.id)
            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="mb-10"
              >
                {lessons.length > 1 && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isCompleted ? 'bg-emerald-500' : 'bg-violet-600'
                      } text-white`}>
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <h2 className={`font-bold ${isCompleted ? 'text-emerald-400' : 'text-white'}`}>
                      {lesson.title}
                    </h2>
                    {isCompleted && (
                      <span className="text-xs text-emerald-600 ml-auto">+{lesson.xpReward} XP получено</span>
                    )}
                  </div>
                )}

                <div className="prose prose-invert max-w-none
                  prose-headings:text-white prose-headings:font-bold
                  prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
                  prose-p:text-slate-300 prose-p:leading-relaxed
                  prose-strong:text-white
                  prose-li:text-slate-300
                  prose-code:text-violet-300 prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                  prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700
                  prose-blockquote:border-violet-500 prose-blockquote:text-slate-400
                ">
                  <ReactMarkdown>{lesson.content || '*Контент не добавлен*'}</ReactMarkdown>
                </div>
              </motion.div>
            )
          })
        )}

        <motion.div
          className="mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={handleComplete}
            disabled={saving}
            className={`w-full py-4 rounded-2xl text-white font-bold text-lg transition-colors ${allDone
              ? 'bg-emerald-600 hover:bg-emerald-500'
              : 'bg-violet-600 hover:bg-violet-500'
              } disabled:opacity-50`}
          >
            {saving ? 'Сохраняем...' : allDone ? '✓ Пройдено' : `Готово — получить ${totalXp} XP`}
          </button>
        </motion.div>
      </div>
      <AchievementToast
        achievements={newAchievements}
        onDismiss={async () => { setNewAchievements([]); await refreshUser(); onBack() }}
      />
    </div>
  )
}