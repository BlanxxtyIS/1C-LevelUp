import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, Zap, BookOpen } from 'lucide-react'
import { getLeaderboard } from '../api'
import { useAuth } from '../context/AuthContext'
import StarField from '../components/layout/StarField'
import Avatar from './layout/Avatar'
import PremiumGlow from './layout/PremiumGlow' 
import PremiumBadge from './layout/PremiumBadge'

interface Leader {
  id: number
  name: string
  totalXp: number
  level: number
  completedLessons: number
  avatarUrl?: string | null
}

interface Props {
  onBack: () => void
}

//const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32']
const medalEmojis = ['🥇', '🥈', '🥉']

export default function LeaderboardPage({ onBack }: Props) {
  const { user } = useAuth()
  const [leaders, setLeaders] = useState<Leader[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLeaderboard().then(data => {
      setLeaders(data)
      setLoading(false)
    })
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0f1a' }}>
      <Loader2 className="text-violet-400 animate-spin" size={40} />
    </div>
  )

  const myPosition = leaders.findIndex(l => l.id === user?.id) + 1

  return (
    <div className="min-h-screen relative" style={{ background: '#0f0f1a' }}>
      <StarField />
      <PremiumGlow />
      <div className="relative px-6 pt-8 pb-4" style={{ zIndex: 1 }}>
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">
                Таблица <span className="text-violet-400">лидеров</span>
              </h1>
            </div>
            {myPosition > 0 && (
              <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
                Ты #{myPosition}
              </span>
              
            )}
            <PremiumBadge />
          </div>
          <p className="text-slate-500 text-sm mb-8 ml-9">Топ по очкам опыта</p>

          {/* Top 3 */}
          {leaders.length >= 3 && (
            <motion.div
              className="flex items-end justify-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* 2nd place */}
              <div className="flex flex-col items-center">
                <Avatar name={leaders[1].name} avatarUrl={leaders[1].avatarUrl} size={56} className="mb-2 border-2 border-slate-500" />
                <div className="text-2xl mb-1">🥈</div>
                <p className="text-white text-xs font-semibold truncate max-w-16 text-center">{leaders[1].name}</p>
                <p className="text-slate-400 text-xs">{leaders[1].totalXp} XP</p>
                <div className="w-16 h-16 rounded-t-xl mt-2" style={{ background: '#1a1a2e', border: '1px solid #334155' }} />
              </div>

              {/* 1st place */}
              <div className="flex flex-col items-center -mb-2">
                <Avatar name={leaders[0].name} avatarUrl={leaders[0].avatarUrl} size={64} className="mb-2 border-2 border-yellow-500" />
                <div className="text-3xl mb-1">🥇</div>
                <p className="text-white text-sm font-bold truncate max-w-20 text-center">{leaders[0].name}</p>
                <p className="text-yellow-400 text-xs font-semibold">{leaders[0].totalXp} XP</p>
                <div className="w-16 h-24 rounded-t-xl mt-2" style={{ background: '#1a1a2e', border: '1px solid #334155' }} />
              </div>

              {/* 3rd place */}
              <div className="flex flex-col items-center">
                <Avatar name={leaders[2].name} avatarUrl={leaders[2].avatarUrl} size={56} className="mb-2 border-2 border-orange-700/50" />
                <div className="text-2xl mb-1">🥉</div>
                <p className="text-white text-xs font-semibold truncate max-w-16 text-center">{leaders[2].name}</p>
                <p className="text-slate-400 text-xs">{leaders[2].totalXp} XP</p>
                <div className="w-16 h-10 rounded-t-xl mt-2" style={{ background: '#1a1a2e', border: '1px solid #334155' }} />
              </div>
            </motion.div>
          )}

          {/* Full list */}
          <div className="flex flex-col gap-2">
            {leaders.map((leader, index) => {
              const isMe = leader.id === user?.id
              const isMedal = index < 3

              return (
                <motion.div
                  key={leader.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 border transition-colors ${
                    isMe ? 'border-violet-700' : 'border-slate-800'
                  }`}
                  style={{ background: isMe ? 'rgba(124,58,237,0.08)' : '#1a1a2e' }}
                >
                  {/* Rank */}
                  <div className="w-8 text-center shrink-0">
                    {isMedal
                      ? <span className="text-lg">{medalEmojis[index]}</span>
                      : <span className="text-slate-500 text-sm font-bold">#{index + 1}</span>
                    }
                  </div>

                  {/* Avatar */}
                  <Avatar
                    name={leader.name}
                    avatarUrl={leader.avatarUrl}
                    size={36}
                    className={isMedal ? `border-2` : ''}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm ${isMe ? 'text-violet-300' : 'text-white'}`}>
                      {leader.name} {isMe && <span className="text-xs text-slate-500">(вы)</span>}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <BookOpen size={10} /> {leader.completedLessons} уроков
                      </span>
                      <span className="text-xs text-slate-600">Ур. {leader.level}</span>
                    </div>
                  </div>

                  {/* XP */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Zap size={12} className="text-yellow-400" />
                    <span className="text-yellow-400 text-sm font-bold">{leader.totalXp}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>

        </div>
      </div>
    </div>
  )
}