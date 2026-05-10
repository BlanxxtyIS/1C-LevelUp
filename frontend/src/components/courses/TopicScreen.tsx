import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Zap, Loader2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { getTopicLessons } from '../../api'
import StarField from '../StarField'

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
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTopicLessons(topic.id).then(data => {
      setLessons(data)
      setLoading(false)
    })
  }, [topic.id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0f1a' }}>
      <Loader2 className="text-violet-400 animate-spin" size={40} />
    </div>
  )

  const totalXp = lessons.reduce((sum, l) => sum + l.xpReward, 0)

  return (
    <div className="min-h-screen relative" style={{ background: '#0f0f1a' }}>
      <StarField />

      {/* Sticky header */}
      <div
        className="sticky top-0 z-10 px-4 py-4 flex items-center gap-3 border-b border-slate-800/60"
        style={{ background: 'rgba(15,15,26,0.95)', backdropFilter: 'blur(8px)' }}
      >
        <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-slate-500 text-xs">{course.emoji} {course.title}</p>
          <p className="text-white font-semibold text-sm truncate">{topic.title}</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Clock size={12} /> {lessons.reduce((sum, l) => sum + (l.durationMinutes ?? 5), 0)} мин
          </span>
          <span className="flex items-center gap-1">
            <Zap size={12} className="text-yellow-400" /> +{totalXp} XP
          </span>
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
          lessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="mb-10"
            >
              {lessons.length > 1 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-xs text-white font-bold">
                    {index + 1}
                  </div>
                  <h2 className="text-white font-bold">{lesson.title}</h2>
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
          ))
        )}

        <motion.div
          className="mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={onBack}
            className="w-full py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-lg transition-colors"
          >
            Готово ✓
          </button>
        </motion.div>
      </div>
    </div>
  )
}