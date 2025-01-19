"use client";


import React from "react";
import Typed from "typed.js";
import { AudioLines } from 'lucide-react';

export default function Home() {

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
    <div className="flex flex-col items-center justify-center absolute w-full h-dvh bg-gradient-to-b from-gray-100 via-green-50 to-green-50">
        <h1 className="text-6xl font-semibold text-center mb-8">
          Music helping
          <br /> 
          you <span className="text-sage2" ref={el} />
        </h1>
          
        <p className="text-xl text-gray-600 mb-8 max-w-2xl text-center">
          Listening to certain types of music helps you concentrate. Explore which songs help you focus the most.
        </p>

        <div className="flex flex-col items-center gap-4">
          <button className="flex items-center gap-2 bg-sage2 text-white px-5 py-2.5 rounded-lg hover:bg-sage1 hover:scale-105 duration-300">
            <span className="mt-1"><AudioLines /></span> Get started!
          </button>
          
        </div>
        
    </div>
  );
}
