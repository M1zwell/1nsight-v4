import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const searchQuery = req.nextUrl.searchParams.get('q')
  if (!searchQuery) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 })
  }

  const contents = await prisma.content.findMany({
    where: {
      OR: [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { body: { contains: searchQuery, mode: 'insensitive' } },
      ],
      AND: [
        {
          OR: [
            { accessLevel: 'PUBLIC' },
            { accessLevel: 'REGISTERED' },
            { accessLevel: session.user.role },
            { authorId: session.user.id },
          ],
        },
      ],
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  })

  return NextResponse.json(contents)
}