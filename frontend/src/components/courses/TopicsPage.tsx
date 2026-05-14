import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronRight, Loader2, FileText, CheckCircle, Lock } from 'lucide-react'
import { getChapterTopics, getChapterProgress } from '../../api'
import { useAuth } from '../../context/AuthContext'
import StarField from '../StarField'
import PremiumGlow from '../PremiumGlow'

interface Topic {
  id: number
  title: string
  description: string
  order: number
  lessonCount: number
}

interface TopicProgress {
  topicId: number
  totalLessons: number
  completedLessons: number
  isCompleted: boolean
}

interface Chapter {
  id: number
  title: string
}

interface Course {
  emoji: string
  color: string
}

interface Props {
  course: Course
  chapter: Chapter
  onBack: () => void
  onTopic: (topic: Topic) => void
}

export default function TopicsPage({ course, chapter, onBack, onTopic }: Props) {
  const { user } = useAuth()
  const [topics, setTopics] = useState<Topic[]>([])
  const [progress, setProgress] = useState<TopicProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const [topicsData, progressData] = await Promise.all([
        getChapterTopics(chapter.id),
        user ? getChapterProgress(chapter.id, user.id) : Promise.resolve([])
      ])
      setTopics(topicsData)
      setProgress(progressData)
      setLoading(false)
    }
    init()
  }, [chapter.id, user])

  function getTopicProgress(topicId: number) {
    return progress.find(p => p.topicId === topicId)
  }

  function isTopicLocked(index: number): boolean {
    if (index === 0) return false
    const prevTopic = topics[index - 1]
    const prevProgress = getTopicProgress(prevTopic.id)
    return !(prevProgress?.isCompleted ?? false)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0f1a' }}>
      <Loader2 className="text-violet-400 animate-spin" size={40} />
    </div>
  )

  const completedCount = progress.filter(p => p.isCompleted).length

  return (
    <div className="min-h-screen relative" style={{ background: '#0f0f1a' }}>
      <StarField />
      <PremiumGlow />
      <div className="relative px-6 pt-8 pb-4" style={{ zIndex: 1 }}>
        <div className="max-w-2xl mx-auto">

          <div className="flex items-center gap-3 mb-2">
            <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <p className="text-slate-500 text-xs">{course.emoji} Глава {chapter.id}</p>
              <h1 className="text-xl font-bold text-white">{chapter.title}</h1>
            </div>
            {completedCount > 0 && (
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle size={12} />
                {completedCount}/{topics.length}
              </span>
            )}
          </div>

          {/* Прогресс-бар главы */}
          {topics.length > 0 && (
            <div className="ml-9 mb-6">
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedCount / topics.length) * 100}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {topics.map((topic, index) => {
              const tp = getTopicProgress(topic.id)
              const isCompleted = tp?.isCompleted ?? false
              const isLocked = isTopicLocked(index)
              const hasProgress = (tp?.completedLessons ?? 0) > 0 && !isCompleted

              return (
                <motion.button
                  key={topic.id}
                  onClick={() => !isLocked && onTopic(topic)}
                  disabled={isLocked}
                  className={`w-full text-left rounded-2xl border transition-colors p-4 ${
                    isLocked
                      ? 'border-slate-800/50 opacity-50 cursor-not-allowed'
                      : isCompleted
                      ? 'border-emerald-800/50 hover:border-emerald-600'
                      : 'border-slate-800 hover:border-violet-700'
                  }`}
                  style={{
                    background: isLocked
                      ? '#151525'
                      : isCompleted
                      ? 'rgba(16,185,129,0.05)'
                      : '#1a1a2e'
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={!isLocked ? { scale: 1.01 } : {}}
                  whileTap={!isLocked ? { scale: 0.99 } : {}}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                      style={{
                        background: isLocked
                          ? 'rgba(51,65,85,0.3)'
                          : isCompleted
                          ? 'rgba(16,185,129,0.2)'
                          : `${course.color}22`,
                        color: isLocked
                          ? '#475569'
                          : isCompleted
                          ? '#10b981'
                          : course.color
                      }}
                    >
                      {isCompleted ? '✓' : topic.order}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm ${
                        isLocked ? 'text-slate-600' : isCompleted ? 'text-emerald-400' : 'text-white'
                      }`}>
                        {topic.title}
                      </p>
                      <p className="text-slate-500 text-xs mt-0.5">{topic.description}</p>
                      {topic.lessonCount > 0 && !isLocked && (
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex items-center gap-1">
                            <FileText size={10} className="text-slate-600" />
                            <span className="text-xs text-slate-600">{topic.lessonCount} уроков</span>
                          </div>
                          {hasProgress && tp && (
                            <span className="text-xs text-violet-400">
                              {tp.completedLessons}/{tp.totalLessons} пройдено
                            </span>
                          )}
                        </div>
                      )}
                      {isLocked && (
                        <p className="text-xs text-slate-600 mt-1">
                          Пройди предыдущую тему
                        </p>
                      )}
                    </div>
                    {isLocked
                      ? <Lock size={16} className="text-slate-700 shrink-0" />
                      : isCompleted
                      ? <CheckCircle size={18} className="text-emerald-500 shrink-0" />
                      : <ChevronRight size={18} className="text-slate-600 shrink-0" />
                    }
                  </div>
                </motion.button>
              )
            })}
          </div>

        </div>
      </div>
    </div>
  )
}