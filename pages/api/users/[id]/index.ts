// pages/api/users/[id]/index.ts
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

  const { id } = req.query

  switch (req.method) {
    case 'GET':
      try {
        const user = await prisma.user.findUnique({
          where: { id: id as string },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
          }
        })
        
        if (!user) {
          return res.status(404).json({ error: 'User not found' })
        }
        
        return res.json(user)
      } catch (error) {
        console.error('Error fetching user:', error)
        return res.status(500).json({ error: 'Internal server error' })
      }

    case 'PUT':
      try {
        const { role } = req.body
        
        const updatedUser = await prisma.user.update({
          where: { id: id as string },
          data: { role },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
          }
        })
        
        return res.json(updatedUser)
      } catch (error) {
        console.error('Error updating user:', error)
        return res.status(500).json({ error: 'Internal server error' })
      }

    case 'DELETE':
      try {
        // Don't allow deleting the current user
        if (id === payload.userId) {
          return res.status(400).json({ error: 'Cannot delete yourself' })
        }

        await prisma.user.delete({
          where: { id: id as string }
        })
        
        return res.json({ message: 'User deleted successfully' })
      } catch (error) {
        console.error('Error deleting user:', error)
        return res.status(500).json({ error: 'Internal server error' })
      }

    default:
      return res.status(405).json({ error: 'Method not allowed' })
  }
}