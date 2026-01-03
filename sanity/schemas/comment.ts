export default {
  name: 'comment',
  title: 'Comment',
  type: 'document',
  fields: [
    {
      name: 'blog',
      title: 'Blog Post',
      type: 'reference',
      to: [{ type: 'blog' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule: any) => Rule.required().email(),
    },
    {
      name: 'comment',
      title: 'Comment',
      type: 'text',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(1).max(5),
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
  ],
  preview: {
    select: {
      name: 'name',
      blog: 'blog.title',
      rating: 'rating',
    },
    prepare(selection: any) {
      const { name, blog, rating } = selection;
      return {
        title: `${name} - ${rating}⭐`,
        subtitle: blog || 'No blog',
      };
    },
  },
};


