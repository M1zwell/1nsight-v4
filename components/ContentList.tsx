"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

interface Content {
  id: string
  title: string
  accessLevel: string
  type: string
  createdAt: string
}

export default function ContentList() {
  const [contents, setContents] = useState<Content[]>([])

  useEffect(() => {
    const fetchContents = async () => {
      const response = await fetch('/api/content')
      if (response.ok) {
        const data = await response.json()
        setContents(data)
      }
    }
    fetchContents()
  }, [])

  return (
    <div className="space-y-4">
      {contents.map((content) => (
        <Link href={`/content/${content.id}`} key={content.id}>
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle>{content.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Access Level: {content.accessLevel}</p>
              <p>Type: {content.type}</p>
              <p>Created: {new Date(content.createdAt).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}