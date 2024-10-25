// Post-related interfaces

/**
 * Represents a blog post.
 */
export interface Post {
  id: number;
  title: string;
  content: string;
  published: boolean;
  authorId: number;
  pdfUrl: string;
}

/**
 * Props for a clickable post component.
 */
export interface ClickablePostProps extends Post {
  handlePostClick: (post: Post) => void;
}

/**
 * Props for a post list component.
 */
export interface PostListProps {
  posts: Post[];
  handlePostClick: (post: Post) => void;
}

/**
 * Represents a post that can be submitted via a form.
 */
export interface SubmittablePost {
  id: number | null;
  title: string;
  content: string | null;
  published: boolean;
  authorId: number | null;
  pdfUrl: string;
  roles: number[];
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
  profilePicture: string | null;
}

// User-related interfaces

/**
 * Represents a user that can be submitted via a form.
 */
export interface SubmittableUser {
  id: number | null;
  email: string;
  username: string;
  password: string;
  name: string | null;
  roles: UserRole[];
}

/**
 * Enum for user roles.
 */
export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

// Modal-related interfaces

/**
 * Props for a generic modal component.
 */
export interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  postId: number;
  onDelete: () => void;
  onRead: () => void;
}

/**
 * Props for the content of a modal component.
 */
export interface ModalContentProps {
  clickedPost?: Post | null;
  isCreating: boolean;
  closeModal: () => void;
  handlePostDelete: () => void;
  isEditing: boolean;
  handleEditPost: () => void;
  handleSuccess: (post: Post) => void;
}

/**
 * Props for the AddToReadingListModal component.
 */
export interface AddToReadingListModalProps {
  postId: number;
  onClose: () => void;
}

// Fetch-related interfaces

/**
 * Parameters for fetching posts.
 */
export interface FetchPostsParams {
  id?: number;
  authorId?: number;
  published?: boolean;
}

// Form-related interfaces

/**
 * Props for the PostForm component.
 * 
 * @property post - Passed post to edit. Optional, if provided edits post, otherwise creates new post.
 * @property submitText - Text representing action. Should be one of "Update Post" or "Create Post" as needed.
 * @property onClose - Callback function called on successful submit.
 * @property onSuccess - Callback function called on successful submit with the created/updated post.
 */
export interface PostFormProps {
  post?: Post;
  submitText: string;
  onSuccess: (post: Post) => void;
  onClose: () => void;
}

export interface CheckboxDropdownProps {
  options: { label: string; value: number }[];
  selectedOptions: number[];
  onChange: (selected: number[]) => void;
}