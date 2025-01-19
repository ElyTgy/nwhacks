import { cookies } from 'next/headers';
import { createClient } from './lib/supabase/server';
import HomePage from '@/components/HomePage';
import "./globals.css";

export default async function Page() {
  return (
    <HomePage />
  );
}