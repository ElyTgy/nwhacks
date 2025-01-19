"use client";

import React, { useState, useEffect } from "react";
import Typed from "typed.js";
import { AudioLines } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { createClient } from '../app/lib/supabase/client';

const supabase = createClient();

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check current auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, []);

  const signInWithSpotify = async () => {
    try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'spotify',
      options: {
        redirectTo: `http://localhost:3000/auth/callback?next=/dashboard`,
        scopes: 'user-read-email user-read-private',
        skipBrowserRedirect: false,
        queryParams: {
            prompt: 'consent'
        }
      }
    })
    if (error) {
        console.error('Spotify auth error:', error)
      }
    } catch (err) {
    console.error('Unexpected error during auth:', err)
    }
  }

  const el = React.useRef(null);
  React.useEffect(() => {
    const typed = new Typed(el.current, { 
      strings: ["focus.", "flow."],
      typeSpeed: 90,
      backSpeed: 50,
      loop: true,
    });
    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div className="flex flex-col items-center absolute w-full h-dvh bg-gradient-to-b from-gray-100 via-green-50 to-green-50">
        <nav className="flex w-full justify-between items-center px-16 my-8">
            <div className="text-xl font-semibold hover:text-sage2 duration-200 cursor-pointer">Home</div>
            <div className="flex space-x-8">
                {!user ? (
                    <></>
                ) : (
                    <div className="text-xl font-semibold hover:text-sage2 duration-200 cursor-pointer">Songs</div>
                )}
                <div className="text-xl font-semibold hover:text-sage2 duration-200 cursor-pointer">
                    {!user ? 'Login' : 'Dashboard'}
                </div>
            </div>
        </nav>

        <div className="flex flex-col justify-center h-[75dvh]">
            <h1 className="text-6xl font-semibold text-center mb-8">
                Music helping
                <br /> 
                you <span className="text-sage2" ref={el} />
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl text-center">
                Listening to certain types of music helps you concentrate. Explore which songs help you focus the most.
            </p>

            <div className="flex flex-col items-center gap-4">
                {!user ? (
                <button 
                    className="flex items-center gap-2 bg-sage2 text-white px-5 py-2.5 rounded-lg hover:bg-sage1 hover:scale-105 duration-300"
                    onClick={signInWithSpotify}
                >
                    <span className="mt-1"><AudioLines /></span> Get started!
                </button>
                ) : (
                <button 
                    className="flex items-center gap-2 bg-sage2 text-white px-5 py-2.5 rounded-lg hover:bg-sage1 hover:scale-105 duration-300"
                    onClick={() => {
                    window.location.href = '/dashboard'
                    }}
                >
                    Dashboard
                </button>
                )}
            </div>
        </div>
    </div>
  );
}
