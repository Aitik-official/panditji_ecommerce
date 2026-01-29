import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Category from '@/models/Category'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const { id } = params

    // Support both MongoDB ObjectId and the old string IDs
    let result = await Category.findByIdAndDelete(id).catch(() => null)
    if (!result) {
      result = await Category.findOneAndDelete({ id: id })
    }

    if (!result) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const { id } = params
    const body = await request.json()

    // Support both MongoDB ObjectId and the old string IDs
    let category = await Category.findByIdAndUpdate(id, body, { new: true }).catch(() => null)
    if (!category) {
      category = await Category.findOneAndUpdate({ id: id }, body, { new: true })
    }

    if (category) {
      return NextResponse.json({ message: 'Category updated successfully', category })
    } else {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}
