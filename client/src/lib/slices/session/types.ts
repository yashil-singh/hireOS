export type User = {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

export type SessionState = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
};
