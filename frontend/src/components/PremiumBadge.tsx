import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function PremiumBadge() {
  const { user } = useAuth()
  if (!user?.isPremium) return null

  return (
    <motion.span
      className="text-xs font-bold px-2 py-0.5 rounded-full"
      style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white' }}
      animate={{ boxShadow: ['0 0 8px rgba(168,85,247,0.6)', '0 0 20px rgba(168,85,247,0.9)', '0 0 8px rgba(168,85,247,0.6)'] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      PRO ✨
    </motion.span>
  )
}