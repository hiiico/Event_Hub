import { User } from './user';

export interface Comment {
  id: string;
  text: string;
  author: User;
  createdAt: string;
}
