import { User } from '../../shared/interfaces/user';

export interface AuthState {
  user: User| null;
  token: string | null;
  loading: boolean;
  error: string | null;
  updateSuccess: boolean;
}

export const initialAuthState: AuthState = {
  user: null,
  token: localStorage.getItem('eventhub_token') || null,
  loading: false,
  error: null,
  updateSuccess: false,
};
