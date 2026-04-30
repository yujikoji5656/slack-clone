import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Skeleton } from '@/components/ui/skeleton'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !session) {
      navigate('/login', { replace: true })
    }
  }, [loading, session, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex">
        <aside className="hidden md:flex w-[260px] flex-shrink-0 bg-[#611f69] flex-col gap-3 p-4">
          <Skeleton className="h-6 w-40 bg-white/10" />
          <Skeleton className="h-4 w-24 bg-white/10" />
          <Skeleton className="h-8 w-full bg-white/10" />
          <Skeleton className="h-8 w-full bg-white/10" />
          <Skeleton className="h-8 w-full bg-white/10" />
        </aside>
        <main className="flex-1 flex flex-col">
          <div className="px-6 py-4 border-b">
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="flex-1 p-6 flex flex-col gap-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-12 w-2/3" />
            <Skeleton className="h-12 w-1/2" />
          </div>
        </main>
      </div>
    )
  }

  if (!session) return null
  return <>{children}</>
}
