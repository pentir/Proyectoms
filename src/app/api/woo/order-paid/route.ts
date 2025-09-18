import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-wc-webhook-signature')
    
    console.log('Webhook recibido - Demo')
    
    if (!signature) {
      return NextResponse.json({ error: 'Firma requerida' }, { status: 401 })
    }

    const orderData = JSON.parse(body)
    
    return NextResponse.json({
      success: true,
      message: 'Webhook procesado (demo)',
      orderId: orderData.id
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
