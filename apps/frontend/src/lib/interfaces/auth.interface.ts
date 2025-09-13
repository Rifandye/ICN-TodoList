export interface IUser {
  id: string;
  userName: string;
  fullName: string;
}

export interface IAuthStore {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
}
