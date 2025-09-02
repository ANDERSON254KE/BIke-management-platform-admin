// pages/api/bikes/[id].ts
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

// Middleware to verify admin token
const verifyAdminToken = (req: NextApiRequest): string | null => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
    if (decoded.role !== 'ADMIN') {
      return null
    }
    return decoded.userId
  } catch (error) {
    return null
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid bike ID' })
  }

  // Verify admin authentication for all operations
  const userId = verifyAdminToken(req)
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    switch (req.method) {
      case 'GET':
        return await handleGet(req, res, id)
      case 'PUT':
        return await handlePut(req, res, id)
      case 'DELETE':
        return await handleDelete(req, res, id)
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
        return res.status(405).json({ error: `Method ${req.method} not allowed` })
    }
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// GET /api/bikes/[id] - Get single bike
async function handleGet(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const bike = await prisma.bike.findUnique({
      where: { id },
      include: {
        images: {
          select: {
            id: true,
            url: true,
            filename: true
          }
        }
      }
    })

    if (!bike) {
      return res.status(404).json({ error: 'Bike not found' })
    }

    return res.status(200).json(bike)
  } catch (error) {
    console.error('Error fetching bike:', error)
    return res.status(500).json({ error: 'Failed to fetch bike' })
  }
}

// PUT /api/bikes/[id] - Update bike
async function handlePut(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const { name, description, pricePerHour, status, trackingId } = req.body

    // Validate required fields
    if (!name || !pricePerHour) {
      return res.status(400).json({ error: 'Name and price per hour are required' })
    }

    // Validate status
    const validStatuses = ['AVAILABLE', 'RENTED', 'MAINTENANCE']
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    // Check if bike exists
    const existingBike = await prisma.bike.findUnique({
      where: { id }
    })

    if (!existingBike) {
      return res.status(404).json({ error: 'Bike not found' })
    }

    // Update bike
    const updatedBike = await prisma.bike.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        pricePerHour: parseFloat(pricePerHour),
        status: status || 'AVAILABLE',
        trackingId: trackingId?.trim() || null
      },
      include: {
        images: {
          select: {
            id: true,
            url: true,
            filename: true
          }
        }
      }
    })

    return res.status(200).json(updatedBike)
  } catch (error) {
    console.error('Error updating bike:', error)
    return res.status(500).json({ error: 'Failed to update bike' })
  }
}

// DELETE /api/bikes/[id] - Delete bike
async function handleDelete(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    // Check if bike exists and get its images
    const existingBike = await prisma.bike.findUnique({
      where: { id },
      include: {
        images: true
      }
    })

    if (!existingBike) {
      return res.status(404).json({ error: 'Bike not found' })
    }

    // Delete associated image files from filesystem
    for (const image of existingBike.images) {
      try {
        const imagePath = path.join(process.cwd(), 'public', image.url)
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath)
        }
      } catch (fileError) {
        console.error('Error deleting image file:', fileError)
        // Continue with deletion even if file removal fails
      }
    }

    // Delete bike (this will cascade delete images due to foreign key constraint)
    await prisma.bike.delete({
      where: { id }
    })

    return res.status(200).json({ message: 'Bike deleted successfully' })
  } catch (error) {
    console.error('Error deleting bike:', error)
    return res.status(500).json({ error: 'Failed to delete bike' })
  }
}