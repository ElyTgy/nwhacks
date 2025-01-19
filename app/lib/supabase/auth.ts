"use server";

import { redirect } from 'next/navigation';
import { createClient } from './server';

export async function logOut() {
    const supabase = createClient();

    const {error} = await supabase.auth.signOut();

    if (error) {
        console.error('Error signing out:', error);
    }
    
    redirect('/');

    return '/';
}
