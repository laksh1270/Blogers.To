import type { NextApiRequest, NextApiResponse } from 'next';
import { client } from '../../../lib/sanity';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { blogId } = req.query;

      if (!blogId || typeof blogId !== 'string') {
        return res.status(400).json({ message: 'Invalid blog ID' });
      }

      const comments = await client.fetch(
        `*[_type == "comment" && blog._ref == $blogId] | order(createdAt desc) {
          _id,
          name,
          email,
          comment,
          rating,
          createdAt
        }`,
        { blogId }
      );

      return res.status(200).json({ comments });
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      return res.status(500).json({
        message: 'Failed to fetch comments',
        error: error.message,
      });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}


