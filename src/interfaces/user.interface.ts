export interface IUser {
  id?: number;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin'; 
  password: string;
  refreshToken: string;
}
