import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession()
  if (!session || session.user.role !== 'CREATOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { title, body, accessLevel, type, reactVersion } = await req.json()
  const content = await prisma.content.create({
    data: {
      title,
      body,
      accessLevel,
      type,
      reactVersion,
      author: { connect: { id: session.user.id } },
    },
  })
  return NextResponse.json(content, { status: 201 })
}

export async function GET(req: NextRequest) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const contents = await prisma.content.findMany({
    where: {
      OR: [
        { accessLevel: 'PUBLIC' },
        { accessLevel: 'REGISTERED' },
        { accessLevel: session.user.role },
        { authorId: session.user.id },
      ],
    },
    include: {
      author: true,
    },
  })
  return NextResponse.json(contents)
}