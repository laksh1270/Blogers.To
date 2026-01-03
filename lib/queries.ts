export const allBlogsQuery = `
  *[_type == "blog"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    author,
    category,
    views,
    commentsEnabled,
    mainImage {
      asset-> {
        _id,
        url
      }
    }
  }
`;

export const blogBySlugQuery = `
  *[_type == "blog" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    content,
    publishedAt,
    author,
    excerpt,
    category,
    views,
    commentsEnabled,
    mainImage {
      asset-> {
        _id,
        url
      }
    }
  }
`;

export const allBlogSlugsQuery = `
  *[_type == "blog"] {
    slug {
      current
    }
  }
`;

