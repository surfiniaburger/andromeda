import { useRef, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { ETypes, MessageCard } from './Atoms/MessageCard'
import { LockClosedIcon } from '@heroicons/react/20/solid'

export default function ForgotPassword() {
  const emailRef = useRef<HTMLInputElement>(null)
  const { resetPassword } = useAuth()
  const [messageType, setMessageType] = useState<ETypes>(ETypes.DANGER)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()

    try {
      setMessage('')
      setLoading(true)
      await resetPassword(emailRef.current?.value)
      setMessageType(ETypes.SUCCESS)
      setMessage('Check your inbox for further instructions')
    } catch {
      setMessageType(ETypes.DANGER)
      setMessage('Failed to reset password')
    }

    setLoading(false)
  }
  return (
    <>
      <div className="flex h-screen items-center justify-center  bg-gray-950 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
          <img
  className="mx-auto h-12 w-auto"
  src="data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjgwIiBmaWxsPSJub25lIiBzdHJva2U9IiM2MWRhZmIiIHN0cm9rZS13aWR0aD0iNSIvPgogIDxwYXRoIGQ9Ik02NSA3MCBRMTAwIDEwMCA2NSA xMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzYxZGFmYiIgc3Ryb2tlLXdpZHRoPSI1IiBzdHJva2UtZGFzaGFycmF5PSI0IDQiPgogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ic3Ryb2tlLWRhc2hvZmZzZXQiIGZyb209IjAiIHRvPSI4IiBkdXI9IjJzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIvPgogIDwvcGF0aD4KICA8cGF0aCBkPSJNMTM1IDcwIFE5MCAxMDAgMTM1IDEzMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjUiIHN0cm9rZS1kYXNoYXJyYXk9IjQgNCI+CiAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJzdHJva2UtZGFzaG9mZnNldCIgZnJvbT0iMCIgdG89IjgiIGR1cj0iMnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+CiAgPC9wYXRoPgogIDxwYXRoIGQ9Ik03MCA3NSBRMTAwIDEwNSA3MCAxMzUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzYxZGFmYiIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbWFzaGFycmF5PSIyIDIiPgogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ic3Ryb2tlLWRhc2hvZmZzZXQiIGZyb209IjAiIHRvPSI0IiBkdXI9IjJzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIvPgogIDwvcGF0aD4KICA8cGF0aCBkPSJNMTMwIDc1IFE5MCAxMDUgMTMwIDEzNSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1kYXNoYXJyYXk9IjIgMiI+CiAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJzdHJva2UtZGFzaG9mZnNldCIgZnJvbT0iMCIgdG89IjQiIGR1cj0iMnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+CiAgPC9wYXRoPgogIDxwYXRoIGQ9IkIxMzAgNzUgUTEwMCAxMDUgMTMwIDEzNSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1kYXNoYXJyYXk9IjIgMiI+CiAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJzdHJva2UtZGFzaG9mZnNldCIgZnJvbT0iMCIgdG89IjQiIGR1cj0iMnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+CiAgPC9wYXRoPgo8L3N2Zz4="
  alt="Animated Baseball Logo"
/>

            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight  text-white">
              Password Reset
            </h2>
          </div>
          <MessageCard
            title={messageType == ETypes.SUCCESS ? 'Success' : 'Error'}
            message={message}
            type={messageType}
            visible={!!message}
          />
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  ref={emailRef}
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div>
              <button
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
                Sign up
              </button>
            </div>
            <div className="text-sm text-center">
              <Link
                className="font-medium text-indigo-600 hover:text-indigo-500"
                to="/login"
              >
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
