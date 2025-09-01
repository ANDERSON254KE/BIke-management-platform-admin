// pages/api/bikes/[id]/image.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    
    const bikeImage = await prisma.bikeImage.findUnique({
      where: { id: id as string }
    });

    if (!bikeImage) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Set appropriate headers
    res.setHeader('Content-Type', 'image/jpeg'); // or whatever format you store
    res.setHeader('Cache-Control', 'public, max-age=3600');
    
    // Send the image buffer
    res.status(200).send(bikeImage.image);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}