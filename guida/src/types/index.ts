// Post-related interfaces
export interface Post {
  id: number;
  title: string;
  content: string;
  published: boolean;
  authorId: number;
}

export interface ClickablePostProps extends Post {
  handlePostClick: (post: Post) => void;
}

export interface PostListProps {
  posts: Post[];
  handlePostClick: (post: Post) => void;
}

export interface SubmittablePost {
  id: number | null;
  title: string;
  content: string | null;
  published: boolean;
  authorId: number | null;
}

export interface FetchedUser {
  id: number | null;
  email: string;
  username: string;
  password: string | null;
  name: string | null;
  createdAt: string;
  updatedAt: string | null;
  roles: UserRole[];
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

export interface ModalContentProps {
  clickedPost?: Post | null;
  isCreating: boolean;
  closeModal: () => void;
  handlePostDelete: () => void;
  isEditing: boolean;
  handleEditPost: () => void;
  handleSuccess: (post: Post) => void;
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

/**
 * PostForm props consists of:
 * * post: Passed post to edit. Optional, if provided edits post, otherwise creates new post
 * * submitText: Text representing action. Should be one of "Update Post" or "Create Post" as needed
 * * OnClose: callback function called on successful submit
 */
export interface IPostForm {
  post?: Post;
  submitText: string;
  onClose: () => void;
  onSuccess: (post: Post) => void;
}