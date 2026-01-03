import type { NextApiRequest, NextApiResponse } from 'next';
import { writeClient } from '../../../lib/sanity';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { title, slug, excerpt, author, category, content } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ message: 'Title and slug are required' });
    }

    // Create a simple content array if not provided
    const blogContent = content || [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Start writing your blog content here...',
          },
        ],
        style: 'normal',
      },
    ];

    const newBlog = {
      _type: 'blog',
      title,
      slug: {
        _type: 'slug',
        current: slug,
      },
      content: blogContent,
      publishedAt: new Date().toISOString(),
      views: 0,
      commentsEnabled: true,
      ...(excerpt && { excerpt }),
      ...(author && { author }),
      ...(category && { category }),
      ...(req.body.mainImage && { mainImage: req.body.mainImage }),
    };

    const createdBlog = await writeClient.create(newBlog);

    return res.status(200).json({ success: true, blog: createdBlog });
  } catch (error: any) {
    console.error('Error creating blog:', error);
    return res.status(500).json({
      message: 'Failed to create blog',
      error: error.message,
    });
  }
}

