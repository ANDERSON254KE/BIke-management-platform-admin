// This endpoint is no longer needed since we're serving images directly from the filesystem
// Images are now stored in /public/uploads/bikes/ and served directly by Next.js

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(410).json({ 
    error: 'This endpoint is deprecated. Images are now served directly from /uploads/bikes/' 
  });
}