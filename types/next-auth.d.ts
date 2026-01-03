import 'next-auth';

declare module 'next-auth' {
  interface User {
    id?: string;
    trusted?: boolean;
    joinedAt?: string;
    postCount?: number;
  }

  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      trusted?: boolean;
      joinedAt?: string;
      postCount?: number;
    };
  }
}


