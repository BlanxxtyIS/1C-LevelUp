import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Zap, Loader2 } from 'lucide-react'
import { getLessonQuestions } from '../api'

interface Question {
  id: number
  text: string
  options: string[]
  correctIndex: number
  explanation: string
}

interface Props {
  lessonId: number
  xpReward: number
  onClose: () => void
  onComplete: (xp: number) => void
}

export default function LessonScreen({ lessonId, xpReward, onClose, onComplete }: Props) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answerState, setAnswerState] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [lives, setLives] = useState(3)
  const [xpEarned, setXpEarned] = useState(0)
  const [finished, setFinished] = useState(false)
  const [failed, setFailed] = useState(false)
  const [_mood, setMood] = useState<'idle' | 'correct' | 'wrong' | 'celebrate'>('idle')

  useEffect(() => {
    getLessonQuestions(lessonId).then(data => {
      setQuestions(data)
      setLoading(false)
    })
  }, [lessonId])

  function reset() {
    setCurrent(0)
    setSelected(null)
    setAnswerState('idle')
    setLives(3)
    setXpEarned(0)
    setFinished(false)
    setFailed(false)
    setMood('idle')
  }

  if (loading) {
    return (
      <motion.div
        className="fixed inset-0 flex items-center justify-center"
        style={{ background: '#0f0f1a' }}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
      >
        <Loader2 className="text-violet-400 animate-spin" size={40} />
      </motion.div>
    )
  }

  const question = questions[current]
  const progress = (current / questions.length) * 100

  if (!question && !finished && !failed) return null

  function handleAnswer(index: number) {
    if (answerState !== 'idle') return
    setSelected(index)
    if (index === question.correctIndex) {
      setAnswerState('correct')
      setXpEarned(p => p + Math.floor(xpReward / questions.length))
      setMood('correct')
    } else {
      setAnswerState('wrong')
      setMood('wrong')
      const newLives = lives - 1
      setLives(newLives)
      if (newLives === 0) {
        // Показываем объяснение и потом переходим к экрану провала
      }
    }
  }

  function handleNext() {
    if (lives === 0) {
      setFailed(true)
      return
    }
    setMood('idle')
    if (current + 1 >= questions.length) {
      setFinished(true)
      setMood('celebrate')
    } else {
      setCurrent(p => p + 1)
      setSelected(null)
      setAnswerState('idle')
    }
  }

  // Экран провала
  if (failed) {
    return (
      <motion.div
        className="fixed inset-0 flex flex-col items-center justify-center"
        style={{ background: '#0f0f1a' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className="text-center px-6"
        >
          <div className="text-7xl mb-6">💔</div>
          <h2 className="text-3xl font-bold text-white mb-2">Жизни закончились!</h2>
          <p className="text-slate-400 mb-10">Не сдавайся — попробуй ещё раз!</p>

          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <motion.button
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-4 rounded-2xl text-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={reset}
            >
              🔄 Попробовать снова
            </motion.button>
            <motion.button
              className="w-full border border-slate-700 text-slate-400 hover:text-white font-bold py-4 rounded-2xl text-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
            >
              Выйти
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  // Экран победы
  if (finished) {
    return (
      <motion.div
        className="fixed inset-0 flex flex-col items-center justify-center"
        style={{ background: '#0f0f1a' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="text-center"
        >
          <div className="text-7xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold text-white mb-2">Урок пройден!</h2>
          <p className="text-slate-400 mb-8">Отличная работа!</p>

          <div className="flex gap-6 justify-center mb-10">
            <div className="bg-slate-800 rounded-2xl px-6 py-4 text-center">
              <p className="text-3xl font-bold text-violet-400">{xpEarned}</p>
              <p className="text-xs text-slate-400 mt-1">XP получено</p>
            </div>
            <div className="bg-slate-800 rounded-2xl px-6 py-4 text-center">
              <p className="text-3xl font-bold text-emerald-400">{lives}</p>
              <p className="text-xs text-slate-400 mt-1">Жизней осталось</p>
            </div>
          </div>

          <motion.button
            className="bg-violet-600 hover:bg-violet-500 text-white font-bold py-4 px-12 rounded-2xl text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onComplete(xpEarned)}
          >
            Продолжить →
          </motion.button>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="fixed inset-0 flex flex-col"
      style={{ background: '#0f0f1a' }}
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25 }}
    >
      {/* Top bar */}
      <div className="flex items-center gap-4 px-6 pt-8 pb-4">
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
          <X size={24} />
        </button>
        <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-violet-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={i === lives && answerState === 'wrong' ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart
                size={20}
                className={i < lives ? 'text-red-500 fill-red-500' : 'text-slate-700'}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 px-6 pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-xs text-violet-400 font-semibold uppercase tracking-wider mb-3">
              Вопрос {current + 1} из {questions.length}
            </p>
            <h2 className="text-xl font-bold text-white mb-8 leading-snug">
              {question.text}
            </h2>

            <div className="flex flex-col gap-3">
              {question.options.map((option, index) => {
                let style = 'border-slate-700 bg-slate-800/50 text-white'
                if (selected === index) {
                  if (answerState === 'correct') style = 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                  if (answerState === 'wrong') style = 'border-red-500 bg-red-500/20 text-red-300'
                } else if (answerState !== 'idle' && index === question.correctIndex) {
                  style = 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                }

                return (
                  <motion.button
                    key={index}
                    className={`w-full text-left px-5 py-4 rounded-2xl border-2 font-medium transition-colors ${style}`}
                    whileHover={answerState === 'idle' ? { scale: 1.02 } : {}}
                    whileTap={answerState === 'idle' ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswer(index)}
                  >
                    {option}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom feedback */}
      <AnimatePresence>
        {answerState !== 'idle' && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className={`px-6 py-6 ${answerState === 'correct'
              ? 'bg-emerald-500/10 border-t border-emerald-500/30'
              : 'bg-red-500/10 border-t border-red-500/30'}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className={`font-bold text-lg mb-1 ${answerState === 'correct' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {answerState === 'correct' ? '✓ Правильно!' : lives === 0 ? '💔 Последняя жизнь!' : '✗ Неверно'}
                </p>
                <p className="text-slate-300 text-sm">{question.explanation}</p>
                {answerState === 'correct' && (
                  <div className="flex items-center gap-1 mt-2">
                    <Zap size={14} className="text-yellow-400" />
                    <span className="text-yellow-400 text-sm font-semibold">
                      +{Math.floor(xpReward / questions.length)} XP
                    </span>
                  </div>
                )}
              </div>
              <motion.button
                className={`shrink-0 font-bold py-3 px-6 rounded-xl text-white ${answerState === 'correct'
                  ? 'bg-emerald-500 hover:bg-emerald-400'
                  : 'bg-red-500 hover:bg-red-400'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
              >
                {lives === 0 && answerState === 'wrong' ? 'Завершить' : 'Далее'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}