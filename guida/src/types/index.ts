export interface Post {
  id: number;
  title: string;
  content: string;
  published: boolean;
  authorId: number;
}

export interface SubmittablePost {
  id: number | null;
  title: string;
  content: string | null;
  published: boolean;
  authorId: number;
}

export interface SubmittableUser {
  id: number | null;
  email: string;
  username: string;
  password: string;
  name: string | null;
  roles: UserRole[];
}

export interface FetchPostsParams {
  id?: number;
  authorId?: number;
  published?: boolean;
}

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

