import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Generator } from '@/pages/Generator'

export default function PrivateRoutes() {
  const { currentUser } = useAuth()

  return currentUser ? (
    <>
      <Generator />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" />
  )
}
