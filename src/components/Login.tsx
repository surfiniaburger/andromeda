import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { LockClosedIcon } from '@heroicons/react/20/solid'
import { ETypes, MessageCard } from './Atoms/MessageCard'
import { SpacerWithText } from './Atoms/SpacerWithText'
import { SocialSignIn } from './SocialSignIn'
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';

export default function Login() {
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const { login, currentUser } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser) navigate('/generator')
  }, [currentUser, navigate])

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()

    try {
      setError('')
      setLoading(true)
      await login(emailRef.current?.value, passwordRef.current?.value)
      navigate('/generator')
    } catch {
      setError('Failed to log in')
    }

    setLoading(false)
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-950 text-white p-4">
      <div className="w-full max-w-md space-y-8">
        <div>
        <img
  className="mx-auto h-12 w-auto"
  src="data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjgwIiBmaWxsPSJub25lIiBzdHJva2U9IiM2MWRhZmIiIHN0cm9rZS13aWR0aD0iNSIvPgogIDxwYXRoIGQ9Ik02NSA3MCBRMTAwIDEwMCA2NSA xMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzYxZGFmYiIgc3Ryb2tlLXdpZHRoPSI1IiBzdHJva2UtZGFzaGFycmF5PSI0IDQiPgogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ic3Ryb2tlLWRhc2hvZmZzZXQiIGZyb209IjAiIHRvPSI4IiBkdXI9IjJzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIvPgogIDwvcGF0aD4KICA8cGF0aCBkPSJNMTM1IDcwIFE5MCAxMDAgMTM1IDEzMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjUiIHN0cm9rZS1kYXNoYXJyYXk9IjQgNCI+CiAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJzdHJva2UtZGFzaG9mZnNldCIgZnJvbT0iMCIgdG89IjgiIGR1cj0iMnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+CiAgPC9wYXRoPgogIDxwYXRoIGQ9Ik03MCA3NSBRMTAwIDEwNSA3MCAxMzUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzYxZGFmYiIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbWFzaGFycmF5PSIyIDIiPgogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ic3Ryb2tlLWRhc2hvZmZzZXQiIGZyb209IjAiIHRvPSI0IiBkdXI9IjJzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIvPgogIDwvcGF0aD4KICA8cGF0aCBkPSJNMTMwIDc1IFE5MCAxMDUgMTMwIDEzNSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1kYXNoYXJyYXk9IjIgMiI+CiAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJzdHJva2UtZGFzaG9mZnNldCIgZnJvbT0iMCIgdG89IjQiIGR1cj0iMnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+CiAgPC9wYXRoPgogIDxwYXRoIGQ9IkIxMzAgNzUgUTEwMCAxMDUgMTMwIDEzNSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1kYXNoYXJyYXk9IjIgMiI+CiAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJzdHJva2UtZGFzaG9mZnNldCIgZnJvbT0iMCIgdG89IjQiIGR1cj0iMnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+CiAgPC9wYXRoPgo8L3N2Zz4="
  alt="Animated Baseball Logo"
/>


          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Sign in to your account
          </h2>
        </div>
        <MessageCard message={error} type={ETypes.DANGER} visible={!!error} />
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                ref={emailRef}
                required
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-700 bg-transparent px-3 py-2 text-white placeholder-gray-400 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <Label htmlFor="password" className="sr-only">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                ref={passwordRef}
                autoComplete="current-password"
                required
                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-700 bg-transparent px-3 py-2 text-white placeholder-gray-400 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-white"
              >
                Remember me
              </Label>
            </div>

            <div className="text-sm">
              <Link
                className="font-medium text-indigo-600 hover:text-indigo-500"
                to="/forgot-password"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="group relative transition-colors flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <LockClosedIcon
                  className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                  aria-hidden="true"
                />
              </span>
              Sign in
            </Button>
          </div>
          <div className="text-sm text-center">
            <Link
              className="font-medium text-indigo-600 hover:text-indigo-500"
              to="/signup"
            >
              Don't have an account?
            </Link>
          </div>
        </form>

        <SpacerWithText text="or" />
        <SocialSignIn setError={setError} enabled={!loading} />
      </div>
    </div>
  )
}
