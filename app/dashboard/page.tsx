"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import ContentList from '@/components/ContentList'
import dynamic from 'next/dynamic'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

export default function Dashboard() {
  const { data: session } = useSession()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [accessLevel, setAccessLevel] = useState('PUBLIC')
  const [type, setType] = useState('ARTICLE')
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, accessLevel, type }),
    })

    if (response.ok) {
      toast({
        title: "Success",
        description: "Content created successfully",
      })
      setTitle('')
      setBody('')
    } else {
      toast({
        title: "Error",
        description: "Failed to create content",
        variant: "destructive",
      })
    }
  }

  if (!session) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Create Content</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="body">Body</Label>
                <ReactQuill
                  value={body}
                  onChange={setBody}
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, false] }],
                      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                      ['link', 'image'],
                      ['clean']
                    ],
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accessLevel">Access Level</Label>
                <select
                  id="accessLevel"
                  value={accessLevel}
                  onChange={(e) => setAccessLevel(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="PUBLIC">Public</option>
                  <option value="REGISTERED">Registered</option>
                  <option value="INVESTOR">Investor</option>
                  <option value="CREATOR">Creator</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="ARTICLE">Article</option>
                  <option value="REPORT">Report</option>
                  <option value="REACT">React</option>
                </select>
              </div>
              <Button type="submit">Create Content</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Your Content</CardTitle>
          </CardHeader>
          <CardContent>
            <ContentList />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}