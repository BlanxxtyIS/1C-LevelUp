import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

export default function PremiumGlow() {
  const { user } = useAuth()
  if (!user?.isPremium) return null

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 3, repeat: Infinity }}
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.15) 0%, transparent 70%)',
        zIndex: 0
      }}
    />
  )
}