// pages/api/users/[id]/change-password.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'No token provided' })

  const payload = await verifyToken(token)
  if (!payload) return res.status(401).json({ error: 'Invalid token' })

  // Verify admin access
  const currentUser = await prisma.user.findUnique({ where: { id: payload.userId } })
  if (!currentUser || currentUser.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' })
  }

  const { id } = req.query

  switch (req.method) {
    case 'PUT':
      try {
        const { newPassword } = req.body
        
        if (!newPassword) {
          return res.status(400).json({ error: 'New password is required' })
        }

        // Hash the new password
        const bcrypt = require('bcryptjs')
        const hashedPassword = await bcrypt.hash(newPassword, 12)

        // Update user password
        const updatedUser = await prisma.user.update({
          where: { id: id as string },
          data: { password: hashedPassword },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
          }
        })

        return res.json({ message: 'Password changed successfully', user: updatedUser })
      } catch (error) {
        console.error('Error changing password:', error)
        return res.status(500).json({ error: 'Internal server error' })
      }

    default:
      return res.status(405).json({ error: 'Method not allowed' })
  }
}
