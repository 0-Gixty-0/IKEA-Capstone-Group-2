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

export interface FetchPostsParams {
  id?: number;
  authorId?: number;
  published?: boolean;
}
