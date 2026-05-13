import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Achievement {
  key: string
  title: string
  emoji: string
}

interface Props {
  achievements: Achievement[]
  onDismiss: () => void
}

export default function AchievementToast({ achievements, onDismiss }: Props) {
  useEffect(() => {
    if (achievements.length === 0) return
    const timer = setTimeout(onDismiss, 4000)
    return () => clearTimeout(timer)
  }, [achievements, onDismiss])

  return (
    <AnimatePresence>
      {achievements.length > 0 && (
        <div className="fixed top-4 left-0 right-0 z-50 flex flex-col items-center gap-2 px-4 pointer-events-none">
          {achievements.map((a, i) => (
            <motion.div
              key={a.key}
              initial={{ opacity: 0, y: -40, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ delay: i * 0.15, type: 'spring', bounce: 0.4 }}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-violet-700/50 pointer-events-auto cursor-pointer"
              style={{ background: 'rgba(124,58,237,0.15)', backdropFilter: 'blur(12px)' }}
              onClick={onDismiss}
            >
              <span className="text-2xl">{a.emoji}</span>
              <div>
                <p className="text-xs text-violet-300 font-semibold uppercase tracking-wider">
                  Новое достижение!
                </p>
                <p className="text-white font-bold text-sm">{a.title}</p>
              </div>
              <span className="text-violet-400 text-lg ml-1">🎉</span>
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}