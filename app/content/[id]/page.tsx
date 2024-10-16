"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'

interface Content {
  id: string
  title: string
  body: string
  accessLevel: string
  type: string
  createdAt: string
  author: {
    name: string
  }
}

export default function ContentPage() {
  const { id } = useParams()
  const [content, setContent] = useState<Content | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchContent = async () => {
      const response = await fetch(`/api/content/${id}`)
      if (response.ok) {
        const data = await response.json()
        setContent(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to load content",
          variant: "destructive",
        })
      }
    }
    fetchContent()
  }, [id, toast])

  if (!content) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{content.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">By {content.author.name}</p>
          <p className="mb-2">Access Level: {content.accessLevel}</p>
          <p className="mb-2">Type: {content.type}</p>
          <p className="mb-4">Created: {new Date(content.createdAt).toLocaleDateString()}</p>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content.body }} />
        </CardContent>
      </Card>
    </div>
  )
}