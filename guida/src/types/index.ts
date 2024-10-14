// Post-related interfaces
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
  authorId: number | null;
}

export interface SubmittableUser {
  id: number | null;
  email: string;
  username: string;
  password: string;
  name: string | null;
  roles: UserRole[];
}

// Modal-related interfaces
export interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  postId: number;
  onDelete: () => void;
}

// Fetch-related interfaces
export interface FetchPostsParams {
  id?: number;
  authorId?: number;
  published?: boolean;
}

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

