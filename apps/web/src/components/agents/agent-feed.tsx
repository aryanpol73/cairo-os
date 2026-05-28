"use client"

import React, { useEffect, useRef } from 'react'
import { useOrchestrationStore } from '../../store/useOrchestrationStore'
import { Terminal, Activity } from 'lucide-react'

export function AgentFeed() {
  const { logs, currentPhase } = useOrchestrationStore()
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll mechanics to stick to the bottom of the log stream as updates arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  return (
    <div className="w-full h-full flex flex-col bg-[#07070c]/90 backdrop-blur-3xl border border-white/5 font-mono text-xs select-text">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between p-4 border-b border-white/5 bg-black/40 shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="relative flex h-2 w-2">
            {currentPhase !== 'idle' && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${currentPhase !== 'idle' ? 'bg-violet-500' : 'bg-neutral-600'}`} />
          </div>
          <span className="text-[10px] font-semibold tracking-widest text-neutral-400 uppercase">Live Orchestration Feed</span>
        </div>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-neutral-500 border border-white/5">
          {currentPhase.toUpperCase()}
        </span>
      </div>

      {/* Main Terminal Window Scroll Area */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-none text-[11px] leading-relaxed"
      >
        {logs.length === 0 ? (
          <div className="h-full w-full flex flex-col items-center justify-center text-neutral-600 text-[10px] space-y-2 font-sans">
            <Terminal className="w-4 h-4 opacity-40 text-neutral-500" />
            <span>Matrix core idle. Awaiting handshake initializing sequence...</span>
          </div>
        ) : (
          logs.map((log) => (
            <div 
              key={log.id} 
              className="p-3 rounded-xl border border-white/5 bg-white/[0.01] space-y-1 hover:bg-white/[0.02] transition-colors duration-200"
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className={`font-bold tracking-wider uppercase ${log.color}`}>
                  [{log.agent}]
                </span>
                <span className="text-neutral-600 text-[9px]">
                  SYS_HANDSHAKE_OK
                </span>
              </div>
              <p className="text-neutral-400 font-sans text-xs tracking-wide pl-1 mt-0.5">
                {log.text}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Terminal Footer Panel */}
      <div className="p-3 border-t border-white/5 bg-black/20 text-[10px] text-neutral-600 flex items-center justify-between shrink-0">
        <span className="flex items-center space-x-1">
          <Activity className="w-3 h-3 text-neutral-500" />
          <span>Stream: Bidirectional WS Channel</span>
        </span>
        <span>Secure Session</span>
      </div>

    </div>
  )
}