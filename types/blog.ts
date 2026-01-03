import { PortableTextBlock } from '@portabletext/react';

export interface BlogPost {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  content: PortableTextBlock[];
  publishedAt: string;
  author?: string;
  excerpt?: string;
  category?: string;
  views?: number;
  commentsEnabled?: boolean;
  mainImage?: {
    asset: {
      _id: string;
      url: string;
    };
  };
}

export interface BlogPostFormData {
  title: string;
  slug: string;
  content: PortableTextBlock[];
  author?: string;
  excerpt?: string;
}

