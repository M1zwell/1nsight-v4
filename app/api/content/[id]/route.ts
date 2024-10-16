import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const content = await prisma.content.findUnique({
    where: { id: params.id },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  })

  if (!content) {
    return NextResponse.json({ error: 'Content not found' }, { status: 404 })
  }

  if (content.accessLevel !== 'PUBLIC' && content.accessLevel !== session.user.role && content.authorId !== session.user.id) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 })
  }

  return NextResponse.json(content)
}