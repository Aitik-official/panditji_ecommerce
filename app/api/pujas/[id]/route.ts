import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Puja from '@/models/Puja'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const { id } = params

    // Support both MongoDB ObjectId and the old string IDs during transition
    let puja = await Puja.findById(id).catch(() => null)
    if (!puja) {
      puja = await Puja.findOne({ id: id })
    }

    if (!puja) {
      return NextResponse.json({ error: 'Puja not found' }, { status: 404 })
    }

    return NextResponse.json(puja)
  } catch (error) {
    console.error('Error fetching puja:', error)
    return NextResponse.json({ error: 'Failed to fetch puja' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const { id } = params

    let result = await Puja.findByIdAndDelete(id).catch(() => null)
    if (!result) {
      result = await Puja.findOneAndDelete({ id: id })
    }

    if (!result) {
      return NextResponse.json({ error: 'Puja not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Puja deleted successfully' })
  } catch (error) {
    console.error('Error deleting puja:', error)
    return NextResponse.json({ error: 'Failed to delete puja' }, { status: 500 })
  }
}
