import { createFileRoute } from '@tanstack/react-router'
import { useSession } from '@/lib/auth-client'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">undefined</h1>
      <p className="text-muted-foreground mb-8">{{PROJECT_DESCRIPTION}}</p>

      {session ? (
        <div>
          <p className="text-lg mb-4">Welcome, {session.user.email}!</p>
          <p className="text-sm text-muted-foreground">You are authenticated.</p>
        </div>
      ) : (
        <div>
          <p className="text-lg mb-4">Please sign in to continue.</p>
        </div>
      )}
    </div>
  )
}
