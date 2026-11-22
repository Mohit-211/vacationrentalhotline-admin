export interface UserProfile {
  name?: string | null;
  mobile?: string | null;
  full_address?: string | null;
}

export interface User {
  id: number;
  email: string;
  is_verified?: boolean | number | null;
  active_property_count?: number | null;
  user_profile?: UserProfile | null;
}

export interface NewUserValues {
  name: string;
  email: string;
}
