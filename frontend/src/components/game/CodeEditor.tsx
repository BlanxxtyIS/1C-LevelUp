import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, Loader2, CheckCircle, XCircle, RotateCcw } from 'lucide-react'
import { executeCode } from '../../api'

interface Props {
  initialCode?: string
}

export default function CodeEditor({ initialCode = '' }: Props) {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState('')
  const [running, setRunning] = useState(false)
  const [success, setSuccess] = useState<boolean | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Автовысота textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.max(120, el.scrollHeight) + 'px'
  }, [code])

  async function handleRun() {
    if (!code.trim() || running) return
    setRunning(true)
    setOutput('')
    setSuccess(null)

    const result = await executeCode(code)
    setOutput(result.output || 'Нет вывода')
    setSuccess(result.success)
    setRunning(false)
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-700 my-4" style={{ background: '#161b22' }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b border-slate-700"
        style={{ background: '#0d1117' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
          <span className="text-slate-500 text-xs ml-2">1С:Скрипт</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setCode(initialCode); setOutput(''); setSuccess(null) }}
            className="text-slate-500 hover:text-slate-300 transition-colors"
            title="Сбросить"
          >
            <RotateCcw size={14} />
          </button>
          <motion.button
            onClick={handleRun}
            disabled={running}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {running
              ? <Loader2 size={12} className="animate-spin" />
              : <Play size={12} />
            }
            {running ? 'Запуск...' : 'Запустить'}
          </motion.button>
        </div>
      </div>

      {/* Code area */}
      <textarea
        ref={textareaRef}
        value={code}
        onChange={e => setCode(e.target.value)}
        className="w-full p-4 text-sm font-mono text-slate-200 resize-none outline-none"
        style={{ background: '#161b22', minHeight: 120, overflow: 'hidden' }}
        placeholder="// Пиши код здесь..."
        spellCheck={false}
      />

      {/* Output */}
      {output && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-t border-slate-700"
          style={{ background: '#161b22' }}
        >
          <div
            className="flex items-center gap-2 px-4 py-2 border-b border-slate-700"
            style={{ background: '#0d1117' }}
          >
            {success
              ? <CheckCircle size={14} className="text-emerald-400" />
              : <XCircle size={14} className="text-red-400" />
            }
            <span className={`text-xs font-semibold ${success ? 'text-emerald-400' : 'text-red-400'}`}>
              {success ? 'Выполнено успешно' : 'Ошибка'}
            </span>
          </div>
          <pre className="px-4 py-3 text-sm font-mono text-slate-300 whitespace-pre-wrap">
            {output}
          </pre>
        </motion.div>
      )}
    </div>
  )
}