// pages/api/admin/dashboard.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'No token provided' })

  const payload = await verifyToken(token)
  if (!payload) return res.status(401).json({ error: 'Invalid token' })

  // Verify admin access
  const user = await prisma.user.findUnique({ where: { id: payload.userId } })
  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' })
  }

  try {
    // Fetch all statistics in a single request
    const [totalBikes, availableBikes, totalBookings, totalAlerts, totalUsers] = await Promise.all([
      prisma.bike.count(),
      prisma.bike.count({ where: { status: 'AVAILABLE' } }),
      prisma.booking.count(),
      prisma.sOSAlert.count({ where: { status: 'PENDING' } }),
      prisma.user.count()
    ])

    const stats = {
      totalBikes,
      availableBikes,
      totalBookings,
      totalAlerts,
      totalUsers
    }

    return res.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}