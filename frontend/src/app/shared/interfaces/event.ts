import { User } from './user';
import { Comment } from './comment';

export interface Event {
  id: string;
  title: string;
  description: string;
  dateTime: string; // ISO string
  location: string;
  category: string;
  organiser: User;
  attendeeCount: number;
  comments?: Comment[];
}
