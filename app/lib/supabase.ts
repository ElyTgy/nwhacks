import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://feayhjboavjnoldgcgsu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlYXloamJvYXZqbm9sZGdjZ3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyMzk0MDQsImV4cCI6MjA1MjgxNTQwNH0.nmxnchWN2Mmo2YjRzSK8VOiKs74bzkIjHKxQPjMLBaU'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;