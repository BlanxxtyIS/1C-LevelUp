import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronRight, Loader2, BookOpen } from 'lucide-react'
import { getCourseChapters } from '../../api'
import StarField from '../StarField'

interface Chapter {
  id: number
  title: string
  description: string
  order: number
  topicCount: number
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
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCourseChapters(course.id).then(data => {
      setChapters(data)
      setLoading(false)
    })
  }, [course.id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0f1a' }}>
      <Loader2 className="text-violet-400 animate-spin" size={40} />
    </div>
  )

  return (
    <div className="min-h-screen relative" style={{ background: '#0f0f1a' }}>
      <StarField />
      <div className="relative px-6 pt-8 pb-4" style={{ zIndex: 1 }}>
        <div className="max-w-2xl mx-auto">

          <div className="flex items-center gap-3 mb-2">
            <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{course.emoji}</span>
              <h1 className="text-2xl font-bold text-white">{course.title}</h1>
            </div>
          </div>
          <p className="text-slate-500 text-sm mb-8 ml-9">Выбери главу для изучения</p>

          <div className="flex flex-col gap-3">
            {chapters.map((chapter, index) => (
              <motion.button
                key={chapter.id}
                onClick={() => onChapter(chapter)}
                className="w-full text-left rounded-2xl border border-slate-800 hover:border-violet-700 transition-colors overflow-hidden"
                style={{ background: '#1a1a2e' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-4 p-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ background: `${course.color}22`, color: course.color }}
                  >
                    {chapter.order}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold">{chapter.title}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{chapter.description}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <BookOpen size={10} className="text-slate-600" />
                      <span className="text-xs text-slate-600">{chapter.topicCount} тем</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-600 shrink-0" />
                </div>
              </motion.button>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}