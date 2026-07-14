'use client'
import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = React.useState('')
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [acceptTerms, setAcceptTerms] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Username validation
  const usernameError = username.length > 0 && !/^[a-zA-Z0-9_]{3,20}$/.test(username)
    ? 'Username must be 3–20 characters (letters, numbers, underscores only)'
    : undefined

  const passwordError = confirmPassword.length > 0 && password !== confirmPassword
    ? 'Passwords do not match'
    : undefined

  const isFormValid = email && username && password && confirmPassword && acceptTerms
    && !usernameError && !passwordError && password.length >= 8

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setIsLoading(true)
    setError(null)

    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          username: username.toLowerCase(),
          display_name: username,
        }
      }
    })

    if (signUpError) {
      if (signUpError.message.toLowerCase().includes('username')) {
        setError('That username is already taken. Please choose another.')
      } else {
        setError(signUpError.message)
      }
      setIsLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-white">Create your account</h2>
        <p className="mt-2 text-gray-400">Join The Queue and start sharing what you love.</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-400 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label htmlFor="reg-email" className="block text-sm font-medium text-gray-300 mb-1.5">Email address</label>
          <Input
            id="reg-email"
            type="email"
            placeholder="you@example.com"
            icon={<Mail className="h-4 w-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1.5">Username</label>
          <Input
            id="username"
            type="text"
            placeholder="cooluser123"
            icon={<User className="h-4 w-4" />}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={usernameError}
            required
            autoComplete="username"
          />
        </div>

        <div>
          <label htmlFor="reg-password" className="block text-sm font-medium text-gray-300 mb-1.5">
            Password <span className="text-gray-500 font-normal">(min. 8 characters)</span>
          </label>
          <Input
            id="reg-password"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="h-4 w-4" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-1.5">Confirm password</label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="h-4 w-4" />}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={passwordError}
            required
            autoComplete="new-password"
          />
        </div>

        <div className="flex items-start gap-3 pt-2">
          <input
            type="checkbox"
            id="terms"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 rounded border-gray-600 bg-gray-700 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-gray-900 cursor-pointer"
          />
          <label htmlFor="terms" className="text-sm text-gray-400 cursor-pointer select-none leading-relaxed">
            I agree to the{' '}
            <Link href="/terms" className="text-indigo-400 hover:text-indigo-300 transition-colors">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300 transition-colors">Privacy Policy</Link>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          disabled={!isFormValid}
          className="w-full mt-2 shadow-lg shadow-indigo-500/20"
        >
          Create Account
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  )
}
