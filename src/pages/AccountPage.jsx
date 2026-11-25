import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { Field, GoogleIcon } from '../components/common/UIPrimitives'
import { ui } from '../constants/store'
import {
  getAuthErrorMessage,
  googleProvider,
  saveUserProfile,
} from '../services/firestore'

function AccountPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('login')
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' })
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        setUser(currentUser)
        setAuthLoading(false)
        setErrorMessage('')

        if (currentUser) {
          try {
            const profileSnapshot = await getDoc(doc(db, 'users', currentUser.uid))
            if (profileSnapshot.data()?.role === 'admin') {
              navigate('/admin', { replace: true })
              return
            }
            await saveUserProfile(currentUser)
          } catch (error) {
            setErrorMessage(
              error?.code === 'permission-denied'
                ? 'You are signed in, but Firestore rules blocked checking your account role or saving your profile.'
                : 'You are signed in, but your account could not be verified. Please try again.',
            )
          }
        }
      },
      (error) => {
        setErrorMessage(getAuthErrorMessage(error))
        setAuthLoading(false)
      },
    )

    return unsubscribe
  }, [navigate])

  const switchTab = (tab) => {
    setActiveTab(tab)
    setErrorMessage('')
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    setErrorMessage('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      if (activeTab === 'login') {
        await signInWithEmailAndPassword(auth, formData.email.trim(), formData.password)
      } else {
        const credential = await createUserWithEmailAndPassword(
          auth,
          formData.email.trim(),
          formData.password,
        )
        if (formData.fullName.trim()) {
          await updateProfile(credential.user, { displayName: formData.fullName.trim() })
        }
      }
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setErrorMessage('')
    setIsSubmitting(true)
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSignOut = async () => {
    setErrorMessage('')
    setIsSubmitting(true)
    try {
      await signOut(auth)
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const perks = [
    'Wishlist saved for future picks',
    'Order history and delivery tracking',
    'Saved addresses and secure checkout',
    'Easy returns and support requests',
  ]

  return (
    <section className={ui.section}>
      <div className={`${ui.container} grid gap-6 lg:grid-cols-2`}>
        <div className={`${ui.card} ${ui.cardPad} sm:p-8`}>
          {authLoading ? (
            <p role="status" className={ui.body}>
              Checking your account…
            </p>
          ) : user ? (
            <div className="space-y-4">
              <span className={ui.eyebrow}>Signed in</span>
              <h1 className={ui.h2}>
                Welcome, {user.displayName || user.email?.split('@')[0] || 'Customer'}
              </h1>
              <p className={ui.body}>{user.email}</p>
              {errorMessage && <p role="alert" className={ui.alertError}>{errorMessage}</p>}
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSubmitting}
                className={ui.btnSecondary}
              >
                {isSubmitting ? 'Signing out…' : 'Sign out'}
              </button>
            </div>
          ) : (
            <>
              <div role="tablist" className="mb-6 flex gap-1 border-b border-[#e2d9c5]">
                {[
                  { id: 'login', label: 'Login' },
                  { id: 'signup', label: 'Sign up' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    type="button"
                    onClick={() => switchTab(tab.id)}
                    className={`border-b-2 px-4 py-3 text-sm font-semibold transition ${
                      activeTab === tab.id
                        ? 'border-[#b88a3e] text-[#2c1e19]'
                        : 'border-transparent text-[#817970] hover:text-[#2c1e19]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {errorMessage && (
                <p role="alert" className={`mb-4 ${ui.alertError}`}>
                  {errorMessage}
                </p>
              )}

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className={`${ui.btnSecondary} w-full`}
              >
                <GoogleIcon />
                {isSubmitting ? 'Please wait…' : 'Continue with Google'}
              </button>

              <div className="my-5 flex items-center gap-3 text-xs text-[#817970]">
                <span className="h-px flex-1 bg-[#e2d9c5]" />
                or continue with email
                <span className="h-px flex-1 bg-[#e2d9c5]" />
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {activeTab === 'signup' && (
                  <Field label="Full name">
                    <input
                      className={ui.input}
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      required
                    />
                  </Field>
                )}
                <Field label="Email">
                  <input
                    className={ui.input}
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    required
                  />
                </Field>
                <Field label="Password">
                  <input
                    className={ui.input}
                    name="password"
                    type="password"
                    autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="At least 6 characters"
                    minLength={6}
                    required
                  />
                </Field>
                <button type="submit" disabled={isSubmitting} className={`${ui.btnPrimary} w-full`}>
                  {isSubmitting
                    ? 'Please wait…'
                    : activeTab === 'login'
                      ? 'Login'
                      : 'Create account'}
                </button>
              </form>
            </>
          )}
        </div>

        <div className="rounded-2xl bg-[#efe7d5] p-6 sm:p-8">
          <span className={ui.eyebrow}>Customer access</span>
          <h2 className={`mt-2 ${ui.h2}`}>Everything you need after purchase</h2>
          <ul className="mt-6 space-y-3">
            {perks.map((perk) => (
              <li key={perk} className="flex items-start gap-3 text-sm text-[#493b32]">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2c1e19] text-white">
                  <Check size={12} strokeWidth={3} />
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default AccountPage
