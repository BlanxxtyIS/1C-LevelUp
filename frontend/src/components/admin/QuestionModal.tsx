import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Check } from 'lucide-react'

interface Question {
  id?: number
  text: string
  options: string[]
  correctIndex: number
  explanation: string
}

interface Props {
  initial?: Question
  onSave: (data: Question) => void
  onClose: () => void
}

export default function QuestionModal({ initial, onSave, onClose }: Props) {
  const [text, setText] = useState(initial?.text ?? '')
  const [options, setOptions] = useState<string[]>(initial?.options ?? ['', '', '', ''])
  const [correctIndex, setCorrectIndex] = useState(initial?.correctIndex ?? 0)
  const [explanation, setExplanation] = useState(initial?.explanation ?? '')

  function handleSave() {
    if (!text.trim() || options.some(o => !o.trim()) || !explanation.trim()) return
    onSave({ id: initial?.id, text, options, correctIndex, explanation })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <motion.div
        className="w-full max-w-lg rounded-2xl p-6 flex flex-col gap-4"
        style={{ background: '#1a1a2e', maxHeight: '90vh', overflowY: 'auto' }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-white font-bold text-lg">
            {initial?.id ? 'Редактировать вопрос' : 'Новый вопрос'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Текст вопроса</label>
          <textarea
            className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 text-sm resize-none border border-slate-700 focus:border-violet-500 outline-none"
            rows={3}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Введите текст вопроса..."
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-2 block">Варианты ответов (нажми ✓ чтобы выбрать правильный)</label>
          <div className="flex flex-col gap-2">
            {options.map((opt, i) => (
              <div key={i} className="flex gap-2 items-center">
                <button
                  onClick={() => setCorrectIndex(i)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                    correctIndex === i
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-600 text-slate-600 hover:border-slate-400'
                  }`}
                >
                  <Check size={14} />
                </button>
                <input
                  className="flex-1 bg-slate-800 text-white rounded-xl px-4 py-2 text-sm border border-slate-700 focus:border-violet-500 outline-none"
                  value={opt}
                  onChange={e => {
                    const next = [...options]
                    next[i] = e.target.value
                    setOptions(next)
                  }}
                  placeholder={`Вариант ${i + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Объяснение (показывается после ответа)</label>
          <textarea
            className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 text-sm resize-none border border-slate-700 focus:border-violet-500 outline-none"
            rows={2}
            value={explanation}
            onChange={e => setExplanation(e.target.value)}
            placeholder="Почему этот ответ правильный?"
          />
        </div>

        <div className="flex gap-3 mt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors text-sm font-medium"
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