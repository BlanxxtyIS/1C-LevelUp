import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronRight, Loader2, BookOpen, CheckCircle } from 'lucide-react'
import { getCourseChapters, getCourseProgress } from '../../api'
import { useAuth } from '../../context/AuthContext'
import StarField from '../StarField'
import PremiumGlow from '../PremiumGlow' 
import PremiumBadge from '../PremiumBadge'

interface Chapter {
  id: number
  title: string
  description: string
  order: number
  topicCount: number
}

interface ChapterProgress {
  chapterId: number
  totalTopics: number
  completedTopics: number
  isCompleted: boolean
}

interface Course {
  id: number
  title: string
  emoji: string
  color: string
}

interface Props {
  course: Course
  onBack: () => void
  onChapter: (chapter: Chapter) => void
}

export default function ChaptersPage({ course, onBack, onChapter }: Props) {
  const { user } = useAuth()
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [progress, setProgress] = useState<ChapterProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const [chaptersData, progressData] = await Promise.all([
        getCourseChapters(course.id),
        user ? getCourseProgress(course.id, user.id) : Promise.resolve([])
      ])
      setChapters(chaptersData)
      setProgress(progressData)
      setLoading(false)
    }
    init()
  }, [course.id, user])

  function getChapterProg(chapterId: number) {
    return progress.find(p => p.chapterId === chapterId)
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
            <div className="flex-1 flex items-center gap-2">
              <span className="text-2xl">{course.emoji}</span>
              <h1 className="text-2xl font-bold text-white">{course.title}</h1>
              <PremiumBadge />
            </div>
            {completedCount > 0 && (
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle size={12} />
                {completedCount}/{chapters.length}
              </span>
            )}
          </div>

          {/* Прогресс курса */}
          {chapters.length > 0 && (
            <div className="ml-9 mb-6">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Прогресс курса</span>
                <span>{Math.round((completedCount / chapters.length) * 100)}%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedCount / chapters.length) * 100}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {chapters.map((chapter, index) => {
              const cp = getChapterProg(chapter.id)
              const isCompleted = cp?.isCompleted ?? false
              const hasProgress = (cp?.completedTopics ?? 0) > 0 && !isCompleted

              return (
                <motion.button
                  key={chapter.id}
                  onClick={() => onChapter(chapter)}
                  className={`w-full text-left rounded-2xl border transition-colors overflow-hidden ${
                    isCompleted
                      ? 'border-emerald-800/50 hover:border-emerald-600'
                      : 'border-slate-800 hover:border-violet-700'
                  }`}
                  style={{ background: isCompleted ? 'rgba(16,185,129,0.05)' : '#1a1a2e' }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center gap-4 p-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                      style={{
                        background: isCompleted ? 'rgba(16,185,129,0.2)' : `${course.color}22`,
                        color: isCompleted ? '#10b981' : course.color
                      }}
                    >
                      {isCompleted ? '✓' : chapter.order}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold ${isCompleted ? 'text-emerald-400' : 'text-white'}`}>
                        {chapter.title}
                      </p>
                      <p className="text-slate-500 text-xs mt-0.5">{chapter.description}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex items-center gap-1">
                          <BookOpen size={10} className="text-slate-600" />
                          <span className="text-xs text-slate-600">{chapter.topicCount} тем</span>
                        </div>
                        {hasProgress && cp && (
                          <span className="text-xs text-violet-400">
                            {cp.completedTopics}/{cp.totalTopics} пройдено
                          </span>
                        )}
                      </div>

                      {/* Мини прогресс-бар */}
                      {cp && cp.totalTopics > 0 && (
                        <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-emerald-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(cp.completedTopics / cp.totalTopics) * 100}%` }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                          />
                        </div>
                      )}
                    </div>
                    {isCompleted
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