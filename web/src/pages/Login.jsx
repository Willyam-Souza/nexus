import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '../services/api'
import { useAuthStore } from '../store/authStore'
import AuroraBackground from '../components/ui/AuroraBackground'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { Logo } from '../components/ui/Logo'
import { PageTransition } from '../components/ui/PageTransition'

const EASE = [0.32, 0.72, 0, 1]

// Orquestra a entrada em cascata: o container "avisa" os filhos quando animar
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data } = await api.post('/auth/login', { email, password })
      login(data.token)
      toast.success('Login efetuado com sucesso!')
      navigate('/dashboard')
    } catch (err) {
      toast.error('Credenciais inválidas. Verifique o seu e-mail e password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <AuroraBackground />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-md"
      >
        <motion.div
          variants={itemVariants}
          className="relative rounded-[2rem] border border-border-subtle bg-surface/80 backdrop-blur-2xl p-9 shadow-xl"
        >
          <motion.div variants={itemVariants} className="mb-8 flex flex-col items-center text-center">
            <Logo iconOnly size={52} className="mb-5" />
            <h1 className="text-3xl font-semibold tracking-tight text-text-primary">Bem-vindo de volta</h1>
            <p className="mt-2 text-[15px] text-text-muted">Entre para continuar a organizar o seu dia</p>
          </motion.div>

          <form onSubmit={handleLogin} className="space-y-5">
            <motion.div variants={itemVariants}>
              <Input
                label="Email"
                icon={Mail}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Input
                label="Password"
                icon={Lock}
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="pt-1">
              <Button type="submit" loading={loading}>
                Entrar <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </form>

          <motion.p variants={itemVariants} className="mt-7 text-center text-sm text-text-muted">
            Ainda não tem conta?{' '}
            <Link to="/register" className="font-semibold text-accent-start hover:underline">
              Registe-se aqui
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </PageTransition>
  )
}
