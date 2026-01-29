import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Category from '@/models/Category'
import { defaultCategories } from '@/lib/seed-data'

export async function GET() {
  try {
    await dbConnect()

    let categories = await Category.find({}).sort({ name: 1 })

    // If no categories exist, seed with defaults
    if (categories.length === 0) {
      console.log('No categories found, seeding from defaults...')
      await Category.insertMany(defaultCategories)
      categories = await Category.find({}).sort({ name: 1 })
    }

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    // Return defaults even on error so site still works
    return NextResponse.json(defaultCategories)
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()

    const newCategory = await Category.create({
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
      description: body.description || '',
      showOnNavbar: body.showOnNavbar || false,
    })

    return NextResponse.json(newCategory, { status: 201 })
  } catch (error: any) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create category' },
      { status: 500 }
    )
  }
}
