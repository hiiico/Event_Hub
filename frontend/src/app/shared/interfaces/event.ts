import { User } from './user';
import { Comment } from './comment';

export interface Event {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  location: string;
  category: string;
  organiser: User;
  attendees?: User[]
  comments?: Comment[];
  latitude?: number | null;
  longitude?: number | null;
}
