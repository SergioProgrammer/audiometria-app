// src/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oeksnceqqtbifzymvvjr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9la3NuY2VxcXRiaWZ6eW12dmpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4Nzc1NzQsImV4cCI6MjA2MTQ1MzU3NH0.JKHxrBy8rFDOxPQFgH-uIaLkh9aIFAE25ASPPKEgFYQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
