import type { NextApiRequest, NextApiResponse } from 'next';
import { writeClient } from '../../../lib/sanity';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { blogId, name, email, comment, rating } = req.body;

      if (!blogId || !name || !email || !comment) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
      }

      const newComment = {
        _type: 'comment',
        blog: {
          _type: 'reference',
          _ref: blogId,
        },
        name,
        email,
        comment,
        rating,
        createdAt: new Date().toISOString(),
      };

      const createdComment = await writeClient.create(newComment);

      return res.status(200).json({ success: true, comment: createdComment });
    } catch (error: any) {
      console.error('Error creating comment:', error);
      return res.status(500).json({
        message: 'Failed to create comment',
        error: error.message,
      });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}


