import type { NextApiRequest, NextApiResponse } from 'next';
import { writeClient } from '../../../lib/sanity';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid blog ID' });
  }

  // Optional: Add token-based protection
  // const authToken = req.headers.authorization;
  // if (authToken !== `Bearer ${process.env.API_AUTH_TOKEN}`) {
  //   return res.status(401).json({ message: 'Unauthorized' });
  // }

  if (req.method === 'PUT') {
    try {
      const { title, excerpt, author, commentsEnabled } = req.body;

      if (!title) {
        return res.status(400).json({ message: 'Title is required' });
      }

      const updatedBlog = await writeClient
        .patch(id)
        .set({
          title,
          ...(excerpt && { excerpt }),
          ...(author && { author }),
          commentsEnabled: commentsEnabled !== undefined ? commentsEnabled : true,
        })
        .commit();

      return res.status(200).json({ success: true, blog: updatedBlog });
    } catch (error: any) {
      console.error('Error updating blog:', error);
      return res.status(500).json({ 
        message: 'Failed to update blog',
        error: error.message 
      });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await writeClient.delete(id);
      return res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('Error deleting blog:', error);
      return res.status(500).json({ 
        message: 'Failed to delete blog',
        error: error.message 
      });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

