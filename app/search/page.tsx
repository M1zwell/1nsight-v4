"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch(`/api/content/search?q=${encodeURIComponent(query)}`)
    if (response.ok) {
      const data = await response.json()
      setResults(data)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search Content</h1>
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-2">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for content..."
            className="flex-grow"
          />
          <Button type="submit">Search</Button>
        </div>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((content: any) => (
          <Card key={content.id} className="cursor-pointer" onClick={() => router.push(`/content/${content.id}`)}>
            <CardHeader>
              <CardTitle>{content.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Access Level: {content.accessLevel}</p>
              <p>Type: {content.type}</p>
              <p>Created: {new Date(content.createdAt).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}