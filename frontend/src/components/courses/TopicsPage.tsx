import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronRight, Loader2, FileText } from 'lucide-react'
import { getChapterTopics } from '../../api'

interface Topic {
  id: number
  title: string
  description: string
  order: number
  lessonCount: number
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
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getChapterTopics(chapter.id).then(data => {
      setTopics(data)
      setLoading(false)
    })
  }, [chapter.id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0f1a' }}>
      <Loader2 className="text-violet-400 animate-spin" size={40} />
    </div>
  )

  return (
    <div className="px-6 pt-8 pb-4" style={{ background: '#0f0f1a' }}>
      <div className="max-w-2xl mx-auto">

        <div className="flex items-center gap-3 mb-2">
          <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className="text-slate-500 text-xs">{course.emoji} Глава {chapter.id}</p>
            <h1 className="text-xl font-bold text-white">{chapter.title}</h1>
          </div>
        </div>
        <p className="text-slate-500 text-sm mb-8 ml-9">Выбери тему</p>

        <div className="flex flex-col gap-3">
          {topics.map((topic, index) => (
            <motion.button
              key={topic.id}
              onClick={() => onTopic(topic)}
              className="w-full text-left rounded-2xl border border-slate-800 hover:border-violet-700 transition-colors p-4"
              style={{ background: '#1a1a2e' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: `${course.color}22`, color: course.color }}
                >
                  {topic.order}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">{topic.title}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{topic.description}</p>
                  {topic.lessonCount > 0 && (
                    <div className="flex items-center gap-1 mt-1.5">
                      <FileText size={10} className="text-slate-600" />
                      <span className="text-xs text-slate-600">{topic.lessonCount} уроков</span>
                    </div>
                  )}
                </div>
                <ChevronRight size={18} className="text-slate-600 shrink-0" />
              </div>
            </motion.button>
          ))}
        </div>

      </div>
    </div>
  )
}