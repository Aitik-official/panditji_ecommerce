import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Puja from '@/models/Puja'
import { defaultPujas } from '@/lib/seed-data'

export async function GET() {
  try {
    await dbConnect()

    let pujas = await Puja.find({}).sort({ createdAt: -1 })

    // If no pujas exist, seed with defaults
    if (pujas.length === 0) {
      console.log('No pujas found, seeding from defaults...')
      await Puja.insertMany(defaultPujas)
      pujas = await Puja.find({}).sort({ createdAt: -1 })
    }

    return NextResponse.json(pujas)
  } catch (error) {
    console.error('Error fetching pujas:', error)
    return NextResponse.json({ error: 'Failed to fetch pujas' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields: name, price, and category are required' },
        { status: 400 }
      )
    }

    const newPuja = await Puja.create({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json(newPuja, { status: 201 })
  } catch (error: any) {
    console.error('Error creating puja:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create puja' },
      { status: 500 }
    )
  }
}
