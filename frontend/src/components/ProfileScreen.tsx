import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, Zap, BookOpen, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getUserProfile } from '../api'

interface Props {
    onBack: () => void
}

interface FullProfile {
    id: number
    name: string
    email: string
    totalXp: number
    level: number
    completedLessons: number
}

export default function ProfileScreen({ onBack }: Props) {
    const { user: authUser, logout } = useAuth()
    const [profile, setProfile] = useState<FullProfile | null>(null)

    useEffect(() => {
        if (!authUser) return
        getUserProfile(authUser.id).then(setProfile)
    }, [authUser])

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0f1a' }}>
                <Loader2 className="text-violet-400 animate-spin" size={40} />
            </div>
        )
    }

    return (
        <div className="min-h-screen px-6 py-8" style={{ background: '#0f0f1a' }}>
            <div className="max-w-sm mx-auto">

                <div className="flex items-center gap-3 mb-10">
                    <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold text-white">Профиль</h1>
                </div>

                <motion.div
                    className="flex flex-col items-center mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="w-20 h-20 rounded-full bg-violet-600/20 border-2 border-violet-600 flex items-center justify-center mb-4">
                        <span className="text-3xl font-bold text-violet-400">
                            {profile.name[0].toUpperCase()}
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                    <p className="text-slate-500 text-sm mt-1">{profile.email}</p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-3 gap-3 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    {[
                        { icon: Star, label: 'Уровень', value: profile.level, color: 'text-yellow-400' },
                        { icon: Zap, label: 'XP', value: profile.totalXp, color: 'text-violet-400' },
                        { icon: BookOpen, label: 'Уроков', value: profile.completedLessons, color: 'text-emerald-400' },
                    ].map(({ icon: Icon, label, value, color }) => (
                        <div key={label} className="rounded-2xl p-4 text-center" style={{ background: '#1a1a2e' }}>
                            <Icon size={20} className={`${color} mx-auto mb-2`} />
                            <p className={`text-xl font-bold ${color}`}>{value}</p>
                            <p className="text-xs text-slate-500 mt-1">{label}</p>
                        </div>
                    ))}
                </motion.div>

                <motion.div
                    className="rounded-2xl p-4 mb-8"
                    style={{ background: '#1a1a2e' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex justify-between text-xs text-slate-400 mb-2">
                        <span>Прогресс уровня {profile.level}</span>
                        <span>{profile.totalXp} / {profile.level * 50} XP</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((profile.totalXp / (profile.level * 50)) * 100, 100)}%` }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        />
                    </div>
                </motion.div>

                <motion.button
                    className="w-full py-3 rounded-xl border border-red-900 text-red-400 hover:bg-red-900/20 transition-colors text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={logout}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Выйти из аккаунта
                </motion.button>

            </div>
        </div>
    )
}