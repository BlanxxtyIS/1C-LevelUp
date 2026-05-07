import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, ChevronRight, ArrowLeft, Zap } from 'lucide-react'
import {
  adminGetCourses, adminCreateCourse, adminUpdateCourse, adminDeleteCourse,
  adminGetChapters, adminCreateChapter, adminUpdateChapter, adminDeleteChapter,
  adminGetTopics, adminCreateTopic, adminUpdateTopic, adminDeleteTopic,
  adminGetTopicLessons, adminCreateTopicLesson, adminUpdateTopicLesson, adminDeleteTopicLesson
} from '../../api'
import SimpleModal from './SimpleModal'

interface Course { id: number; title: string; description: string; emoji: string; color: string; order: number; chapterCount: number }
interface Chapter { id: number; title: string; description: string; order: number; topicCount: number }
interface Topic { id: number; title: string; description: string; order: number; lessonCount: number }
interface Lesson { id: number; title: string; description: string; xpReward: number; order: number; questionCount: number }

type Level = 'courses' | 'chapters' | 'topics' | 'lessons'

const COURSE_FIELDS = [
  { key: 'title', label: 'Название', placeholder: '1С Основы' },
  { key: 'description', label: 'Описание', placeholder: 'Описание курса' },
  { key: 'emoji', label: 'Эмодзи', placeholder: '📚' },
  { key: 'color', label: 'Цвет (hex)', placeholder: '#7c3aed' },
  { key: 'order', label: 'Порядок', type: 'number' as const },
]

const CHAPTER_FIELDS = [
  { key: 'title', label: 'Название', placeholder: 'Введение в платформу' },
  { key: 'description', label: 'Описание', placeholder: 'Описание главы' },
  { key: 'order', label: 'Порядок', type: 'number' as const },
]

const TOPIC_FIELDS = [
  { key: 'title', label: 'Название', placeholder: 'Что такое 1С?' },
  { key: 'description', label: 'Описание', placeholder: 'Описание темы' },
  { key: 'order', label: 'Порядок', type: 'number' as const },
]

const LESSON_FIELDS = [
  { key: 'title', label: 'Название', placeholder: 'Введение' },
  { key: 'description', label: 'Описание', placeholder: 'Описание урока' },
  { key: 'xpReward', label: 'XP', type: 'number' as const },
  { key: 'order', label: 'Порядок', type: 'number' as const },
  { key: 'content', label: 'Контент (Markdown)', placeholder: `## Заголовок\n\nТекст урока...\n\n**Жирный текст**\n\n- Пункт 1\n- Пункт 2`, type: 'textarea' as const },
]


export default function CourseAdmin() {
  const [level, setLevel] = useState<Level>('courses')
  const [courses, setCourses] = useState<Course[]>([])
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [modal, setModal] = useState<{ open: boolean; item?: any }>({ open: false })

  useEffect(() => { loadCourses() }, [])

  async function loadCourses() { setCourses(await adminGetCourses()) }
  async function loadChapters(id: number) { setChapters(await adminGetChapters(id)) }
  async function loadTopics(id: number) { setTopics(await adminGetTopics(id)) }
  async function loadLessons(id: number) { setLessons(await adminGetTopicLessons(id)) }

  async function handleSave(data: any) {
    if (level === 'courses') {
      if (modal.item?.id) await adminUpdateCourse(modal.item.id, data)
      else await adminCreateCourse(data)
      await loadCourses()
    } else if (level === 'chapters' && selectedCourse) {
      if (modal.item?.id) await adminUpdateChapter(modal.item.id, data)
      else await adminCreateChapter(selectedCourse.id, data)
      await loadChapters(selectedCourse.id)
    } else if (level === 'topics' && selectedChapter) {
      if (modal.item?.id) await adminUpdateTopic(modal.item.id, data)
      else await adminCreateTopic(selectedChapter.id, data)
      await loadTopics(selectedChapter.id)
    } else if (level === 'lessons' && selectedTopic) {
      if (modal.item?.id) await adminUpdateTopicLesson(modal.item.id, data)
      else await adminCreateTopicLesson(selectedTopic.id, data)
      await loadLessons(selectedTopic.id)
    }
    setModal({ open: false })
  }

  async function handleDelete(id: number) {
    if (!confirm('Удалить?')) return
    if (level === 'courses') { await adminDeleteCourse(id); await loadCourses() }
    else if (level === 'chapters' && selectedCourse) { await adminDeleteChapter(id); await loadChapters(selectedCourse.id) }
    else if (level === 'topics' && selectedChapter) { await adminDeleteTopic(id); await loadTopics(selectedChapter.id) }
    else if (level === 'lessons' && selectedTopic) { await adminDeleteTopicLesson(id); await loadLessons(selectedTopic.id) }
  }

  function goBack() {
    if (level === 'lessons') setLevel('topics')
    else if (level === 'topics') { setLevel('chapters'); setSelectedChapter(null) }
    else if (level === 'chapters') { setLevel('courses'); setSelectedCourse(null) }
  }

  const currentFields = level === 'courses' ? COURSE_FIELDS
    : level === 'chapters' ? CHAPTER_FIELDS
    : level === 'topics' ? TOPIC_FIELDS
    : LESSON_FIELDS

  const currentItems: any[] = level === 'courses' ? courses
    : level === 'chapters' ? chapters
    : level === 'topics' ? topics
    : lessons

  const addLabel = level === 'courses' ? 'Курс'
    : level === 'chapters' ? 'Глава'
    : level === 'topics' ? 'Тема'
    : 'Урок'

  const breadcrumb = level === 'courses' ? 'Курсы'
    : level === 'chapters' ? `${selectedCourse?.emoji} ${selectedCourse?.title}`
    : level === 'topics' ? `${selectedChapter?.title}`
    : `${selectedTopic?.title}`

  const subInfo = (item: any) => {
    if (level === 'courses') return `${item.chapterCount} глав`
    if (level === 'chapters') return `${item.topicCount} тем`
    if (level === 'topics') return `${item.lessonCount} уроков`
    return `${item.questionCount} вопросов · ${item.xpReward} XP`
  }

  const isClickable = level !== 'lessons'

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        {level !== 'courses' && (
          <button onClick={goBack} className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </button>
        )}
        <h2 className="text-white font-bold text-lg">{breadcrumb}</h2>
      </div>

      {/* Add button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setModal({ open: true })}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
        >
          <Plus size={16} /> {addLabel}
        </button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {currentItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 rounded-2xl px-4 py-3 border border-slate-800"
            style={{ background: '#0f0f1a' }}
          >
            {level === 'courses'
              ? <span className="text-2xl shrink-0">{item.emoji}</span>
              : <div className="w-7 h-7 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center text-xs font-bold shrink-0">{item.order}</div>
            }

            <div
              className={`flex-1 min-w-0 ${isClickable ? 'cursor-pointer' : ''}`}
              onClick={() => {
                if (level === 'courses') { setSelectedCourse(item); loadChapters(item.id); setLevel('chapters') }
                else if (level === 'chapters') { setSelectedChapter(item); loadTopics(item.id); setLevel('topics') }
                else if (level === 'topics') { setSelectedTopic(item); loadLessons(item.id); setLevel('lessons') }
              }}
            >
              <p className="text-white font-semibold text-sm">{item.title}</p>
              <p className="text-slate-500 text-xs mt-0.5">{item.description}</p>
              <div className="flex items-center gap-1 mt-1">
                <Zap size={10} className="text-slate-600" />
                <span className="text-xs text-slate-600">{subInfo(item)}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setModal({ open: true, item })}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-violet-400 transition-colors"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors"
              >
                <Trash2 size={14} />
              </button>
              {isClickable && <ChevronRight size={16} className="text-slate-600" />}
            </div>
          </motion.div>
        ))}
      </div>

      {modal.open && (
        <SimpleModal
          title={`${modal.item?.id ? 'Редактировать' : 'Новый'} ${addLabel.toLowerCase()}`}
          fields={currentFields}
          initial={modal.item}
          onSave={handleSave}
          onClose={() => setModal({ open: false })}
        />
      )}
    </div>
  )
}