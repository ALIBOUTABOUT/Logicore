import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

const hasValidUrl = Boolean(
  supabaseUrl &&
  !supabaseUrl.includes('your-project-ref') &&
  (supabaseUrl.startsWith('https://') || supabaseUrl.startsWith('http://'))
);

const hasValidKey = Boolean(
  supabaseAnonKey &&
  !supabaseAnonKey.includes('your-anon-key-here')
);

export const isMissingEnv = !hasValidUrl || !hasValidKey;

// Create a real client only when valid env vars are present
export const supabase = isMissingEnv
  ? (null as unknown as ReturnType<typeof createClient>)
  : createClient(supabaseUrl!, supabaseAnonKey!);
