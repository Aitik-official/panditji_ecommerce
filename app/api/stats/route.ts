import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Puja from '@/models/Puja'

export async function GET() {
    try {
        await dbConnect()

        const totalPujas = await Puja.countDocuments()

        // In a real application, you would also fetch bookings and revenue
        // For now, we return actual puja count and mock values for others
        return NextResponse.json({
            totalPujas,
            totalBookings: 0,
            totalRevenue: 0,
        })
    } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        return NextResponse.json({
            totalPujas: 0,
            totalBookings: 0,
            totalRevenue: 0
        })
    }
}
