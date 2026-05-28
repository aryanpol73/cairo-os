"use client"

import React from 'react'
import { Cpu, Wifi } from 'lucide-react'

export function Header() {
  return (
    <header className="w-full h-16 flex items-center justify-between px-8 border-b border-white/[0.03] bg-transparent z-50">
      
      {/* Left: Brand Identity */}
      <div className="flex items-center space-x-3">
        <div className="p-1.5 rounded-lg bg-gradient-to-b from-white/10 to-transparent border border-white/10 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
          <Cpu className="w-4 h-4 text-violet-300" />
        </div>
        <span className="text-sm font-sans font-medium tracking-widest text-neutral-200">
          CAIRO <span className="text-neutral-600">OS</span>
        </span>
      </div>

      {/* Right: System Telemetry */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.02] border border-white/[0.05]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
            System Online
          </span>
        </div>
        <Wifi className="w-4 h-4 text-neutral-600" />
      </div>
      
    </header>
  )
}