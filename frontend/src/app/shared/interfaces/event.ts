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
  // attendeeCount: number;
  attendees?: User[]
  comments?: Comment[];
  latitude?: number | null;  // Add optional coordinates
  longitude?: number | null;
}
