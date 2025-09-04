export type UUID = string;

export interface Profile {
  id: UUID;
  email: string;
  display_name: string | null;
  start_date: string;        // YYYY-MM-DD
  created_at: string;
  updated_at: string;
}

export interface Prompt {
  id: number;
  day_number: number;
  title: string | null;
  body: string;
  created_at: string;
}

export interface Entry {
  id: number;
  user_id: UUID;
  day_number: number;
  content: string;
  created_at: string;
  updated_at: string;
}
