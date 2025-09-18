import { NextResponse } from 'next/server'

export async function GET() {
  console.log('TEST API funcionando')
  return NextResponse.json({ message: 'API funciona correctamente' })
}
