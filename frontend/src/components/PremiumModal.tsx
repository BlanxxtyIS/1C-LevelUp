import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap, Star, BookOpen, Trophy } from 'lucide-react'

interface Props {
    onClose: () => void
    onLegal: () => void
}

export default function PremiumModal({ onClose, onLegal }: Props) {
    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center px-4"
                style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="w-full max-w-sm rounded-3xl p-6 border border-violet-800/50"
                    style={{ background: '#1a1a2e' }}
                    initial={{ scale: 0.8, opacity: 0, y: 40 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: 'spring', bounce: 0.3 }}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>

                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="text-5xl mb-3">👑</div>
                        <h2 className="text-2xl font-bold text-white mb-1">1C LevelUp Pro</h2>
                        <p className="text-slate-400 text-sm">Разблокируй полный доступ</p>
                    </div>

                    {/* Features */}
                    <div className="flex flex-col gap-3 mb-6">
                        {[
                            { icon: Zap, text: 'Все уроки игрового режима', color: 'text-violet-400' },
                            { icon: BookOpen, text: 'Полный доступ к курсам', color: 'text-emerald-400' },
                            { icon: Star, text: 'Все достижения и бейджи', color: 'text-yellow-400' },
                            //{ icon: Trophy, text: 'Таблица лидеров', color: 'text-orange-400' },
                        ].map(({ icon: Icon, text, color }) => (
                            <div key={text} className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center ${color}`}>
                                    <Icon size={16} />
                                </div>
                                <p className="text-slate-300 text-sm">{text}</p>
                            </div>
                        ))}
                    </div>

                    {/* Price */}
                    <div className="rounded-2xl p-4 mb-4 text-center border border-violet-700/30" style={{ background: 'rgba(124,58,237,0.1)' }}>
                        <p className="text-3xl font-bold text-white">250 ₽</p>
                        <p className="text-slate-400 text-sm">в месяц</p>
                    </div>

                    {/* Free tier info */}
                    <p className="text-center text-xs text-slate-500 mb-4">
                        Первые 100 XP — бесплатно 🎁
                    </p>

                    {/* CTA */}
                    <motion.button
                        className="w-full py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-lg transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => alert('Скоро! Платёжная система в разработке 🚀')}
                    >
                        Оформить подписку
                    </motion.button>

                    <p className="text-center text-xs text-slate-600 mt-3">
                        Отмена в любое время ·{' '}
                        <button
                            onClick={onLegal}
                            className="text-violet-500 hover:text-violet-400 underline"
                        >
                            Оферта
                        </button>
                    </p>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}