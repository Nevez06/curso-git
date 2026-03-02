import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET: Listar fornecedores
export async function GET() {
  const fornecedores = await prisma.fornecedor.findMany({
    include: { pessoa: true, produtos: true },
    orderBy: { avaliacaoMedia: 'desc' }
  })
  return NextResponse.json({ fornecedores })
}
