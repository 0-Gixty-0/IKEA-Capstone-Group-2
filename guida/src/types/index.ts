export interface Post {
  id: number;
  title: string;
  content: string;
  published: boolean;
  authorId: number;
}

export interface FetchPostsParams {
  id?: number;
  authorId?: number;
  published?: boolean;
}
