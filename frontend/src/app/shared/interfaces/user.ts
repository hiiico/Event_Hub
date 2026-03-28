export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserCredentials {
  id?: string;
  name: string;
  email: string;
  password: string;
  tel?: string;
}
