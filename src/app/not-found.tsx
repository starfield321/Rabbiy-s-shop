'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6 text-black">
      <div className="text-center space-y-8">
        <h1 className="text-[120px] md:text-[200px] font-black italic tracking-tighter leading-none">
          404<span className="text-red-600">.</span>
        </h1>
        
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">Error_Detected</p>
          <p className="text-xl font-black italic uppercase tracking-tight">
            The_Page_You_Are_Looking_For_Does_Not_Exist.
          </p>
        </div>

        <Link 
          href="/" 
          className="inline-block bg-black text-white px-12 py-6 font-black italic uppercase text-xs tracking-[0.3em] hover:bg-red-600 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none"
        >
          Back_To_Initial_System_
        </Link>
      </div>
    </main>
  );
}