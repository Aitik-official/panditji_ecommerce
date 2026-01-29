import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Puja from '@/models/Puja'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const { id } = params
    console.log(`Fetching puja with ID: ${id}`)

    let puja = null

    // 1. Try finding by MongoDB ObjectID if it looks like one
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      puja = await Puja.findById(id).catch(() => null)
    }

    // 2. If not found by ObjectID, try the custom 'id' field (only for legacy IDs like '1', '2')
    if (!puja) {
      console.log(`Puja not found by _id, trying custom 'id' field for: ${id}`)
      puja = await Puja.findOne({ id: id }).catch(() => null)
    }

    if (puja) {
      console.log(`Successfully found puja: ${puja.name} (ID: ${puja._id})`)
    } else {
      console.warn(`Puja NOT found for ID: ${id}`)
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
