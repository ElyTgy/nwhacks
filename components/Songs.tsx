"use client";

import Link from "next/link";
import {logOut} from "../app/lib/supabase/auth";

export default function Songs() {
    return (
    <div className="flex flex-col items-center absolute w-full h-dvh bg-gradient-to-b from-gray-100 via-green-50 to-green-50">
        <nav className="flex w-full justify-between items-center px-16 my-8">
            <Link href="/" className="text-xl font-semibold hover:text-sage2 duration-200">
                Home
            </Link>
            <div className="flex space-x-8">
                <Link href="/songs" className="text-xl font-semibold hover:text-sage2 duration-200">
                    Songs
                </Link>
                <button 
                    onClick={() => logOut()}
                    className="text-xl font-semibold hover:text-sage2 duration-200"
                >
                    Logout
                </button>
            </div>
        </nav>
    </div>
    );
}