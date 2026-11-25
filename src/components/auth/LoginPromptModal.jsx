import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../../firebase'
import { ui } from '../../constants/store'
import { getAuthErrorMessage, googleProvider } from '../../services/firestore'
import { GoogleIcon } from '../common/UIPrimitives'

export function LoginPromptModal({ isOpen, onClose }) {
  const [loginMode, setLoginMode] = useState('login')
  const [loginForm, setLoginForm] = useState({ fullName: '', email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  useEffect(() => {
    if (!isOpen) return undefined
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoginError('')
    setIsAuthenticating(true)

    try {
      if (loginMode === 'signup') {
        const credential = await createUserWithEmailAndPassword(
          auth,
          loginForm.email.trim(),
          loginForm.password,
        )
        if (loginForm.fullName.trim()) {
          await updateProfile(credential.user, { displayName: loginForm.fullName.trim() })
        }
      } else {
        await signInWithEmailAndPassword(auth, loginForm.email.trim(), loginForm.password)
      }
    } catch (error) {
      setLoginError(getAuthErrorMessage(error))
    } finally {
      setIsAuthenticating(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoginError('')
    setIsAuthenticating(true)
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      setLoginError(getAuthErrorMessage(error))
    } finally {
      setIsAuthenticating(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#2c1e19]/55 px-4 py-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-login-title"
        className="relative my-auto w-full max-w-md rounded-2xl border border-[#e2d9c5] bg-[#fffdf7] p-6 shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={() => {
            onClose()
            setLoginError('')
          }}
          aria-label="Close login prompt"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-[#71645b] transition hover:bg-[#eee7d7]"
        >
          <X size={20} />
        </button>
        <span className={ui.eyebrow}>Secure checkout</span>
        <h2 id="cart-login-title" className={`mt-2 ${ui.h2}`}>
          {loginMode === 'login' ? 'Login to continue' : 'Create your account'}
        </h2>
        <p className={`mt-2 ${ui.body}`}>
          Sign in or create an account to continue with your order.
        </p>

        <div role="tablist" className="mt-5 flex gap-1 border-b border-[#e2d9c5]">
          {[
            { id: 'login', label: 'Login' },
            { id: 'signup', label: 'Sign up' },
          ].map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={loginMode === tab.id}
              type="button"
              onClick={() => {
                setLoginMode(tab.id)
                setLoginError('')
              }}
              className={`border-b-2 px-4 py-3 text-sm font-semibold transition ${
                loginMode === tab.id
                  ? 'border-[#b88a3e] text-[#2c1e19]'
                  : 'border-transparent text-[#817970] hover:text-[#2c1e19]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loginError && <p role="alert" className={`mt-4 ${ui.alertError}`}>{loginError}</p>}

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isAuthenticating}
          className={`${ui.btnSecondary} mt-4 w-full`}
        >
          <GoogleIcon />
          {isAuthenticating ? 'Please wait…' : 'Continue with Google'}
        </button>

        <div className="my-4 flex items-center gap-3 text-xs text-[#817970]">
          <span className="h-px flex-1 bg-[#e2d9c5]" />
          or continue with email
          <span className="h-px flex-1 bg-[#e2d9c5]" />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {loginMode === 'signup' && (
            <label className="flex flex-col gap-1.5">
              <span className={ui.label}>Full name</span>
              <input
                className={ui.input}
                name="fullName"
                autoComplete="name"
                value={loginForm.fullName}
                onChange={(event) =>
                  setLoginForm((current) => ({ ...current, fullName: event.target.value }))
                }
                required
              />
            </label>
          )}
          <label className="flex flex-col gap-1.5">
            <span className={ui.label}>Email</span>
            <input
              className={ui.input}
              name="email"
              type="email"
              autoComplete="email"
              value={loginForm.email}
              onChange={(event) =>
                setLoginForm((current) => ({ ...current, email: event.target.value }))
              }
              required
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={ui.label}>Password</span>
            <input
              className={ui.input}
              name="password"
              type="password"
              autoComplete={loginMode === 'login' ? 'current-password' : 'new-password'}
              minLength={6}
              value={loginForm.password}
              onChange={(event) =>
                setLoginForm((current) => ({ ...current, password: event.target.value }))
              }
              required
            />
          </label>
          <button type="submit" disabled={isAuthenticating} className={`${ui.btnPrimary} w-full`}>
            {isAuthenticating
              ? 'Please wait…'
              : loginMode === 'login'
                ? 'Login and continue'
                : 'Create account and continue'}
          </button>
        </form>

        <Link to="/cart" onClick={onClose} className={`${ui.btnGhost} mt-3 w-full`}>
          Back to cart
        </Link>
      </section>
    </div>
  )
}

export function CheckoutLoginGate({ authReady, onOpenLogin }) {
  useEffect(() => {
    if (authReady) onOpenLogin()
  }, [authReady, onOpenLogin])

  return (
    <section className={ui.section}>
      <div className={`${ui.card} mx-auto max-w-xl p-6 text-center sm:p-10`}>
        <span className={ui.eyebrow}>Secure checkout</span>
        <h1 className={`mt-2 ${ui.h2}`}>Login to continue</h1>
        <p className={`mt-3 ${ui.body}`}>
          Please log in or create an account before placing your order.
        </p>
        {authReady ? (
          <button type="button" onClick={onOpenLogin} className={`${ui.btnPrimary} mt-6 w-full`}>
            Login / Sign up
          </button>
        ) : (
          <p role="status" className="mt-6 text-sm text-[#71645b]">
            Checking your account…
          </p>
        )}
        <Link to="/cart" className={`${ui.btnGhost} mt-3 w-full`}>
          Back to cart
        </Link>
      </div>
    </section>
  )
}
