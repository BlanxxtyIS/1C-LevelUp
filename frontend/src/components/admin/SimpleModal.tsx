import { useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

interface Field {
  key: string
  label: string
  placeholder?: string
  type?: 'text' | 'number' | 'textarea'
}

interface Props {
  title: string
  fields: Field[]
  initial?: Record<string, any>
  onSave: (data: Record<string, any>) => void
  onClose: () => void
}

export default function SimpleModal({ title, fields, initial, onSave, onClose }: Props) {
  const [values, setValues] = useState<Record<string, any>>(
    initial ?? Object.fromEntries(fields.map(f => [f.key, f.type === 'number' ? 1 : '']))
  )

  function handleSave() {
    const hasEmpty = fields
      .filter(f => f.type !== 'number' && f.key !== 'content')
      .some(f => !values[f.key]?.toString().trim())
    if (hasEmpty) return
    onSave(values)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <motion.div
        className="w-full max-w-2xl rounded-2xl p-6 flex flex-col gap-4"
        style={{ background: '#1a1a2e', maxHeight: '90vh', overflowY: 'auto' }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-white font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {fields.map(field => (
          <div key={field.key}>
            <label className="text-xs text-slate-400 mb-1 block">{field.label}</label>

            {field.type === 'textarea' ? (
              <textarea
                className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 text-sm border border-slate-700 focus:border-violet-500 outline-none resize-none font-mono"
                placeholder={field.placeholder}
                rows={16}
                value={values[field.key] ?? ''}
                onChange={e => setValues(prev => ({ ...prev, [field.key]: e.target.value }))}
              />
            ) : (
              <input
                type={field.type ?? 'text'}
                className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 text-sm border border-slate-700 focus:border-violet-500 outline-none"
                placeholder={field.placeholder}
                value={values[field.key] ?? ''}
                onChange={e => setValues(prev => ({
                  ...prev,
                  [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value
                }))}
              />
            )}
          </div>
        ))}

        <div className="flex gap-3 mt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white transition-colors text-sm"
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