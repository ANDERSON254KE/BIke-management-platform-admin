// pages/api/users/index.ts
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

  switch (req.method) {
    case 'GET':
      try {
        const users = await prisma.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' }
        })
        return res.json(users)
      } catch (error) {
        console.error('Error fetching users:', error)
        return res.status(500).json({ error: 'Internal server error' })
      }

    case 'POST':
      try {
        const { name, email, password, role } = req.body

        // Validate required fields
        if (!name || !email || !password) {
          return res.status(400).json({ error: 'Name, email, and password are required' })
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
          return res.status(400).json({ error: 'User with this email already exists' })
        }

        // Create user with hashed password
        const hashedPassword = await hashPassword(password)
        const newUser = await prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            role: role || 'USER'
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
          }
        })

        return res.status(201).json(newUser)
      } catch (error) {
        console.error('Error creating user:', error)
        return res.status(500).json({ error: 'Internal server error' })
      }

    default:
      return res.status(405).json({ error: 'Method not allowed' })
  }
}

// Helper function to hash passwords
async function hashPassword(password: string): Promise<string> {
  const bcrypt = require('bcryptjs')
  return bcrypt.hash(password, 12)
}