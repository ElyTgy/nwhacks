"use client";

import { logOut }  from '../app/lib/supabase/auth';

export default function Dashboard() {

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl">HELLO</h1>
            <button 
            className="flex items-center gap-2 bg-red-500 text-white px-5 py-2.5 rounded-lg hover:bg-red-600 hover:scale-105 duration-300"
            onClick={() => logOut()}
          >
            Log Out
          </button>
        </div>
    );
}