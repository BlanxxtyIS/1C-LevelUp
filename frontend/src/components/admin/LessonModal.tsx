import { useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

interface LessonData {
  id?: number
  title: string
  description: string
  xpReward: number
  order: number
  topic: string
}

interface Props {
  initial?: LessonData
  nextOrder: number
  onSave: (data: LessonData) => void
  onClose: () => void
}

export default function LessonModal({ initial, nextOrder, onSave, onClose }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [xpReward, setXpReward] = useState(initial?.xpReward ?? 20)
  const [order, setOrder] = useState(initial?.order ?? nextOrder)
  const [topic, setTopic] = useState(initial?.topic ?? '1c-basics')

  function handleSave() {
    if (!title.trim()) return
    onSave({ id: initial?.id, title, description, xpReward, order, topic })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <motion.div
        className="w-full max-w-md rounded-2xl p-6 flex flex-col gap-4"
        style={{ background: '#1a1a2e' }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-white font-bold text-lg">
            {initial?.id ? 'Редактировать урок' : 'Новый урок'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {[
          { label: 'Название', value: title, set: setTitle, placeholder: 'Например: Документы в 1С' },
          { label: 'Описание', value: description, set: setDescription, placeholder: 'Краткое описание урока' },
          { label: 'Топик (slug)', value: topic, set: setTopic, placeholder: '1c-basics' },
        ].map(({ label, value, set, placeholder }) => (
          <div key={label}>
            <label className="text-xs text-slate-400 mb-1 block">{label}</label>
            <input
              className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 text-sm border border-slate-700 focus:border-violet-500 outline-none"
              value={value}
              onChange={e => set(e.target.value)}
              placeholder={placeholder}
            />
          </div>
        ))}

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs text-slate-400 mb-1 block">XP за урок</label>
            <input
              type="number"
              className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 text-sm border border-slate-700 focus:border-violet-500 outline-none"
              value={xpReward}
              onChange={e => setXpReward(Number(e.target.value))}
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-slate-400 mb-1 block">Порядок</label>
            <input
              type="number"
              className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 text-sm border border-slate-700 focus:border-violet-500 outline-none"
              value={order}
              onChange={e => setOrder(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white transition-colors text-sm font-medium"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white transition-colors text-sm font-bold"
          >
            Сохранить
          </button>
        </div>
      </motion.div>
    </div>
  )
}