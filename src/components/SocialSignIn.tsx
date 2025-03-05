import { FaGithub, FaGoogle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button';

export interface ISocialSignInProps {
  enabled?: boolean
  setError: (error: string) => void
}

export function SocialSignIn({ enabled = true, setError }: ISocialSignInProps) {
  const { googleSignin, githubSignin } = useAuth()
  const navigate = useNavigate()

  async function handleGoogleLogin(): Promise<void> {
    try {
      setError('')
      await googleSignin()
      navigate('/')
    } catch {
      setError('Failed to log in with Google')
    }
  }

  async function handleGithubLogin(): Promise<void> {
    try {
      setError('')
      await githubSignin()
      navigate('/')
    } catch (err) {
      console.log(err)
      setError('Failed to log in with GitHub')
    }
  }
  return (
    <div className=" gap-2 flex justify-between flex-wrap">
      <Button
        onClick={handleGoogleLogin}
        disabled={!enabled}
         className="w-full flex items-center justify-center border border-gray-700 bg-transparent text-white py-2 px-4 hover:bg-gray-800 transition-colors"
      >
        <span className="inset-y-0 left-0 flex items-center ">
          <FaGoogle className="h-7 w-7  text-gray-500 group-hover:text-gray-600" />
        </span>
      </Button>
      <Button
        onClick={handleGithubLogin}
        disabled={!enabled}
         className="w-full flex items-center justify-center border border-gray-700 bg-transparent text-white py-2 px-4 hover:bg-gray-800 transition-colors"
      >
        <span className="inset-y-0 left-0 flex items-center ">
          <FaGithub className="h-7 w-7  text-gray-500 group-hover:text-gray-600" />
        </span>
      </Button>
    </div>
  )
}
