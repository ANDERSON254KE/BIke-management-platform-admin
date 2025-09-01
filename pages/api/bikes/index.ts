// pages/api/bikes/index.ts (updated)
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });

  const payload = await verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Invalid token' });

  // Verify admin access
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const bikes = await prisma.bike.findMany({
          select: {
            id: true,
            name: true,
            description: true,
            pricePerHour: true,
            status: true,
            trackingId: true,
            createdAt: true,
            images: { 
              select: { 
                id: true, 
                createdAt: true,
                // Include image URLs for display
              } 
            }
          },
          orderBy: { createdAt: 'desc' }
        });
        
        return res.json(bikes);
      } catch (error) {
        console.error('Error fetching bikes:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

    case 'POST': {
      try {
        const { name, description, pricePerHour, status, trackingId, images } = req.body;

        // Validate required fields
        if (!name || !pricePerHour) {
          return res.status(400).json({ error: 'Name and pricePerHour are required' });
        }

        // Validate pricePerHour is a valid number
        const price = parseFloat(pricePerHour);
        if (isNaN(price) || price <= 0) {
          return res.status(400).json({ error: 'pricePerHour must be a valid positive number' });
        }

        // Generate random tracking ID if not provided
        const finalTrackingId = trackingId || `BIKE${Math.floor(Math.random() * 9000) + 1000}`;

        // Create the bike first
        const bike = await prisma.bike.create({
          data: {
            name,
            description: description || null,
            pricePerHour: price,
            status: status || 'AVAILABLE',
            trackingId: finalTrackingId
          }
        });

        // Handle image uploads if provided (simplified for now)
        if (Array.isArray(images) && images.length > 0) {
          // For now, we'll just save the bike and handle image processing separately
          // In a real app, you'd upload to storage and save image references
        }

        // Return the bike with basic information
        return res.status(201).json({
          ...bike,
          images: [] // Return empty images array for now
        });

      } catch (error) {
        console.error('Error creating bike:', error);
        return res.status(500).json({ 
          error: 'Internal server error',
          details: process.env.NODE_ENV === 'development' ? error : undefined
        });
      }
    }

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}