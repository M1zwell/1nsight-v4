import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to the Research Platform
        </h1>
        <p className="mt-3 text-2xl">
          Access cutting-edge research and insights
        </p>
        <div className="flex mt-6">
          <Link href="/auth/signin" passHref>
            <Button className="mr-4">Sign In</Button>
          </Link>
          <Link href="/auth/signup" passHref>
            <Button variant="outline">Sign Up</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}