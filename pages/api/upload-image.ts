import type { NextApiRequest, NextApiResponse } from 'next';
import { writeClient } from '../../lib/sanity';
import { urlFor } from '../../lib/sanity';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { imageData, filename, mimetype } = req.body;

    if (!imageData) {
      return res.status(400).json({ message: 'No image data provided' });
    }

    // Convert base64 to buffer
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Upload to Sanity
    const asset = await writeClient.assets.upload('image', buffer, {
      filename: filename || 'image.jpg',
      contentType: mimetype || 'image/jpeg',
    });

    // Get the image URL
    const imageUrl = urlFor(asset).width(800).url() || asset.url;

    return res.status(200).json({
      success: true,
      imageUrl,
      assetId: asset._id,
    });
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return res.status(500).json({
      message: 'Failed to upload image',
      error: error.message,
    });
  }
}

