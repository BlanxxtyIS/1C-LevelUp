import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp, ArrowLeft, Zap } from 'lucide-react'
import {
  adminGetLessons, adminCreateLesson, adminUpdateLesson, adminDeleteLesson,
  adminGetQuestions, adminCreateQuestion, adminUpdateQuestion, adminDeleteQuestion
} from '../../api'
import LessonModal from './LessonModal'
import QuestionModal from './QuestionModal'
import CourseAdmin from './CourseAdmin'

interface Lesson {
  id: number; title: string; description: string
  xpReward: number; order: number; topic: string; questionCount: number
}

interface Question {
  id: number; text: string; options: string[]
  correctIndex: number; explanation: string
}

interface Props {
  onBack: () => void
}

export default function AdminPanel({ onBack }: Props) {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null)
  const [questions, setQuestions] = useState<Record<number, Question[]>>({})
  const [lessonModal, setLessonModal] = useState<{ open: boolean; lesson?: Lesson }>({ open: false })
  const [questionModal, setQuestionModal] = useState<{ open: boolean; lessonId?: number; question?: Question }>({ open: false })
  const [tab, setTab] = useState<'lessons' | 'courses'>('lessons')

  useEffect(() => { loadLessons() }, [])

  async function loadLessons() {
    setLessons(await adminGetLessons())
  }

  async function toggleLesson(id: number) {
    if (expandedLesson === id) { setExpandedLesson(null); return }
    setExpandedLesson(id)
    if (!questions[id]) {
      const data = await adminGetQuestions(id)
      setQuestions(prev => ({ ...prev, [id]: data }))
    }
  }

  async function handleSaveLesson(data: any) {
    if (data.id) await adminUpdateLesson(data.id, data)
    else await adminCreateLesson(data)
    await loadLessons()
    setLessonModal({ open: false })
  }

  async function handleDeleteLesson(id: number) {
    if (!confirm('Удалить урок и все его вопросы?')) return
    await adminDeleteLesson(id)
    await loadLessons()
    if (expandedLesson === id) setExpandedLesson(null)
  }

  async function handleSaveQuestion(lessonId: number, data: any) {
    if (data.id) await adminUpdateQuestion(data.id, data)
    else await adminCreateQuestion(lessonId, data)
    const updated = await adminGetQuestions(lessonId)
    setQuestions(prev => ({ ...prev, [lessonId]: updated }))
    await loadLessons()
    setQuestionModal({ open: false })
  }

  async function handleDeleteQuestion(lessonId: number, questionId: number) {
    if (!confirm('Удалить вопрос?')) return
    await adminDeleteQuestion(questionId)
    const updated = await adminGetQuestions(lessonId)
    setQuestions(prev => ({ ...prev, [lessonId]: updated }))
    await loadLessons()
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto" style={{ background: '#0f0f1a' }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-white">
            Админ <span className="text-violet-400">панель</span>
          </h1>
        </div>
        {tab === 'lessons' && (
          <button
            onClick={() => setLessonModal({ open: true })}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
          >
            <Plus size={16} /> Урок
          </button>
        )}
        {tab === 'courses' && (
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('courseAdminAdd'))}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
          >
            <Plus size={16} /> Добавить
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-800 rounded-2xl p-1 mb-6">
        {(['lessons', 'courses'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${tab === t ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
          >
            {t === 'lessons' ? '🎮 Игровые уроки' : '📚 Курсы'}
          </button>
        ))}
      </div>

      {/* Courses tab */}
      {tab === 'courses' && <CourseAdmin />}

      {/* Lessons tab */}
      {tab === 'lessons' && (
        <div className="flex flex-col gap-3">
          {lessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl overflow-hidden border border-slate-800"
              style={{ background: '#1a1a2e' }}
            >
              <div className="flex items-center gap-3 px-4 py-4">
                <div
                  className="w-8 h-8 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center text-xs font-bold shrink-0 cursor-pointer"
                  onClick={() => toggleLesson(lesson.id)}
                >
                  {lesson.order}
                </div>

                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => toggleLesson(lesson.id)}>
                  <p className="text-white font-semibold text-sm truncate">{lesson.title}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-slate-500">{lesson.description}</span>
                    <span className="flex items-center gap-1 text-xs text-yellow-500">
                      <Zap size={10} />{lesson.xpReward} XP
                    </span>
                    <span className="text-xs text-slate-600">{lesson.questionCount} вопр.</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setLessonModal({ open: true, lesson })}
                    className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-violet-400 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteLesson(lesson.id)}
                    className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                  <button
                    onClick={() => toggleLesson(lesson.id)}
                    className="w-8 h-8 flex items-center justify-center text-slate-400"
                  >
                    {expandedLesson === lesson.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {expandedLesson === lesson.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-slate-800 overflow-hidden"
                  >
                    <div className="px-4 py-3 flex flex-col gap-2">
                      {(questions[lesson.id] ?? []).map((q, qi) => (
                        <div key={q.id} className="flex items-start gap-3 bg-slate-800/50 rounded-xl px-3 py-3">
                          <span className="text-xs text-slate-500 mt-0.5 shrink-0 w-4">{qi + 1}.</span>
                          <p className="flex-1 text-sm text-slate-300 leading-snug">{q.text}</p>
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => setQuestionModal({ open: true, lessonId: lesson.id, question: q })}
                              className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-violet-400 transition-colors"
                            >
                              <Pencil size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(lesson.id, q.id)}
                              className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-red-400 transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => setQuestionModal({ open: true, lessonId: lesson.id })}
                        className="flex items-center gap-2 text-xs text-violet-400 hover:text-violet-300 transition-colors py-1 mt-1"
                      >
                        <Plus size={14} /> Добавить вопрос
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {lessonModal.open && (
        <LessonModal
          initial={lessonModal.lesson}
          nextOrder={lessons.length + 1}
          onSave={handleSaveLesson}
          onClose={() => setLessonModal({ open: false })}
        />
      )}

      {questionModal.open && questionModal.lessonId && (
        <QuestionModal
          initial={questionModal.question}
          onSave={data => handleSaveQuestion(questionModal.lessonId!, data)}
          onClose={() => setQuestionModal({ open: false })}
        />
      )}
    </div>
  )
}