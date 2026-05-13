import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, ChevronRight, Loader2, CheckCircle } from 'lucide-react'
import { getCourses, getCourseProgress } from '../../api'
import { useAuth } from '../../context/AuthContext'
import StarField from '../StarField'
import PremiumGlow from '../PremiumGlow' 
import PremiumBadge from '../PremiumBadge'

interface Course {
  id: number
  title: string
  description: string
  emoji: string
  color: string
  chapterCount: number
}

interface Props {
  onBack: () => void
  onCourse: (course: Course) => void
}

export default function CoursesPage({ onBack, onCourse }: Props) {
  const { user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [progressMap, setProgressMap] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const coursesData = await getCourses()
      setCourses(coursesData)

      if (user) {
        const progressResults = await Promise.all(
          coursesData.map((c: Course) => getCourseProgress(c.id, user.id))
        )
        const map: Record<number, number> = {}
        coursesData.forEach((c: Course, i: number) => {
          const prog = progressResults[i]
          const completed = prog.filter((p: any) => p.isCompleted).length
          const total = prog.length
          map[c.id] = total > 0 ? Math.round((completed / total) * 100) : 0
        })
        setProgressMap(map)
      }

      setLoading(false)
    }
    init()
  }, [user])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0f1a' }}>
      <Loader2 className="text-violet-400 animate-spin" size={40} />
    </div>
  )

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
            <h1 className="text-2xl font-bold text-white">
              Курсы <span className="text-violet-400">1C LevelUp</span>
            </h1>
            <PremiumBadge />
          </div>
          <p className="text-slate-500 text-sm mb-8 ml-9">Выбери курс для изучения</p>

          <div className="flex flex-col gap-3">
            {courses.map((course, index) => {
              const pct = progressMap[course.id] ?? 0
              const isCompleted = pct === 100

              return (
                <motion.button
                  key={course.id}
                  onClick={() => onCourse(course)}
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
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl shrink-0"
                      style={{ background: `${course.color}22`, border: `1px solid ${course.color}44` }}
                    >
                      {course.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold ${isCompleted ? 'text-emerald-400' : 'text-white'}`}>
                        {course.title}
                      </p>
                      <p className="text-slate-500 text-xs mt-0.5">{course.description}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <BookOpen size={10} className="text-slate-600" />
                        <span className="text-xs text-slate-600">{course.chapterCount} глав</span>
                        {pct > 0 && (
                          <span className="text-xs text-emerald-500">{pct}% пройдено</span>
                        )}
                      </div>

                      {/* Прогресс-бар */}
                      {pct > 0 && (
                        <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-emerald-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6 }}
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