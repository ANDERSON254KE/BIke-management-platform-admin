// pages/api/bikes/index.ts (updated)
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// Disable body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

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
                url: true,
                filename: true,
                createdAt: true
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
        // Parse form data including files
        const form = formidable({
          uploadDir: path.join(process.cwd(), 'public/uploads/bikes'),
          keepExtensions: true,
          maxFileSize: 5 * 1024 * 1024, // 5MB limit
          multiples: true,
        });

        const [fields, files] = await form.parse(req);

        // Extract form fields
        const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
        const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
        const pricePerHour = Array.isArray(fields.pricePerHour) ? fields.pricePerHour[0] : fields.pricePerHour;
        const status = Array.isArray(fields.status) ? fields.status[0] : fields.status;
        const trackingId = Array.isArray(fields.trackingId) ? fields.trackingId[0] : fields.trackingId;

        // Validate required fields
        if (!name || !pricePerHour) {
          return res.status(400).json({ error: 'Name and pricePerHour are required' });
        }

        // Validate pricePerHour is a valid number
        const price = parseFloat(pricePerHour as string);
        if (isNaN(price) || price <= 0) {
          return res.status(400).json({ error: 'pricePerHour must be a valid positive number' });
        }

        // Generate random tracking ID if not provided
        const finalTrackingId = trackingId || `BIKE${Math.floor(Math.random() * 9000) + 1000}`;

        // Create the bike first
        const bike = await prisma.bike.create({
          data: {
            name: name as string,
            description: (description as string) || '',
            pricePerHour: price,
            status: (status as any) || 'AVAILABLE',
            trackingId: finalTrackingId
          }
        });

        // Handle image uploads
        const imageFiles = files.images;
        const savedImages = [];

        if (imageFiles) {
          const filesToProcess = Array.isArray(imageFiles) ? imageFiles : [imageFiles];
          
          for (const file of filesToProcess) {
            if (file && file.filepath) {
              // Generate unique filename
              const ext = path.extname(file.originalFilename || '.jpg');
              const filename = `${bike.id}_${Date.now()}_${Math.random().toString(36).substring(7)}${ext}`;
              const newPath = path.join(process.cwd(), 'public/uploads/bikes', filename);
              
              // Move file to final location
              fs.renameSync(file.filepath, newPath);
              
              // Save image record to database
              const savedImage = await prisma.bikeImage.create({
                data: {
                  bikeId: bike.id,
                  url: `/uploads/bikes/${filename}`,
                  filename: filename
                }
              });
              
              savedImages.push(savedImage);
            }
          }
        }

        // Return the bike with images
        return res.status(201).json({
          ...bike,
          images: savedImages
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