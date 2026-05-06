import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, ChevronRight, Loader2 } from 'lucide-react'
import { getCourses } from '../../api'

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
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCourses().then(data => {
      setCourses(data)
      setLoading(false)
    })
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0f1a' }}>
      <Loader2 className="text-violet-400 animate-spin" size={40} />
    </div>
  )

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: '#0f0f1a' }}>
      <div className="max-w-lg mx-auto">

        <div className="flex items-center gap-3 mb-8">
          <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-white">
            Курсы <span className="text-violet-400">1C LevelUp</span>
          </h1>
        </div>

        <div className="flex flex-col gap-4">
          {courses.map((course, index) => (
            <motion.button
              key={course.id}
              onClick={() => onCourse(course)}
              className="w-full text-left rounded-2xl p-5 border border-slate-800 hover:border-violet-700 transition-colors"
              style={{ background: '#1a1a2e' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                  style={{ background: `${course.color}22`, border: `1px solid ${course.color}44` }}
                >
                  {course.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-white font-bold text-lg">{course.title}</h2>
                  <p className="text-slate-400 text-sm mt-0.5">{course.description}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <BookOpen size={12} className="text-slate-500" />
                    <span className="text-xs text-slate-500">{course.chapterCount} глав</span>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-600 shrink-0" />
              </div>
            </motion.button>
          ))}
        </div>

      </div>
    </div>
  )
}