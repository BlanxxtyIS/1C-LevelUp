import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { register, login } from '../api'
import StarField from './StarField'

export default function AuthScreen() {
  const { login: authLogin } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setError('')
    setLoading(true)

    try {
      const res = mode === 'register'
        ? await register(username, email, password)
        : await login(email, password)

      if (res.error) {
        setError(res.error)
      } else {
        authLogin(res.token, res.user)
      }
    } catch {
      setError('Ошибка соединения с сервером')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative" style={{ background: '#0f0f1a' }}>
      <StarField />
      <motion.div
        className="w-full max-w-sm relative"
        style={{ zIndex: 1 }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: '#0f0f1a' }}>
          <motion.div
            className="w-full max-w-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Logo */}
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-white">
                1C <span className="text-violet-400">LevelUp</span>
              </h1>
              <p className="text-slate-500 mt-2 text-sm">Учи 1С играючи</p>
            </div>

            {/* Tabs */}
            <div className="flex bg-slate-800 rounded-2xl p-1 mb-6">
              {(['login', 'register'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError('') }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${mode === m ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                >
                  {m === 'login' ? 'Войти' : 'Регистрация'}
                </button>
              ))}
            </div>

            {/* Form */}
            <div className="flex flex-col gap-3">
              <AnimatePresence>
                {mode === 'register' && (
                  <motion.input
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 text-sm border border-slate-700 focus:border-violet-500 outline-none"
                    placeholder="Имя пользователя"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                )}
              </AnimatePresence>

              <input
                className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 text-sm border border-slate-700 focus:border-violet-500 outline-none"
                placeholder="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />

              <input
                className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 text-sm border border-slate-700 focus:border-violet-500 outline-none"
                placeholder="Пароль"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-xs text-center"
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3.5 rounded-xl mt-2 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? '...' : mode === 'login' ? 'Войти' : 'Создать аккаунт'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}