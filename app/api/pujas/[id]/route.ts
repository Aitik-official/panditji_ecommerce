import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const STORAGE_FILE = path.join(process.cwd(), 'data', 'pujas.json')

function getPujasFromStorage(): any[] {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading pujas from storage:', error)
  }
  return []
}

function savePujasToStorage(pujas: any[]): void {
  try {
    const dataDir = path.dirname(STORAGE_FILE)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(pujas, null, 2))
  } catch (error) {
    console.error('Error saving pujas to storage:', error)
    throw error
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const pujas = getPujasFromStorage()
    const puja = pujas.find((p: any) => p.id === id)

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
    const { id } = params

    // TODO: Replace with actual database delete
    // Example with MongoDB:
    // const result = await db.collection('pujas').deleteOne({ _id: new ObjectId(id) })

    const pujas = getPujasFromStorage()
    const filtered = pujas.filter((p: any) => p.id !== id)
    savePujasToStorage(filtered)

    return NextResponse.json({ message: 'Puja deleted successfully' })
  } catch (error) {
    console.error('Error deleting puja:', error)
    return NextResponse.json({ error: 'Failed to delete puja' }, { status: 500 })
  }
}
