export interface IUser {
  id: string;
  name: string;
  email: string;
  role: {
    id: string;
    name: string;
  };
  avatar: string;
}
