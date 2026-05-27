"use client"

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOrchestrationStore } from "../../store/useOrchestrationStore"
import { TerminalSquare, Activity } from 'lucide-react'

const getSimulatedLogs = (phase: string) => {
  if (phase === 'idle') return [{ id: 1, agent: 'SYSTEM', text: 'Awaiting initialization prompt...', color: 'text-neutral-500' }]
  if (phase === 'discovery') return [
    { id: 1, agent: 'ARCHITECT', text: 'Analyzing scope parameters...', color: 'text-purple-400' },
    { id: 2, agent: 'ARCHITECT', text: 'Extracting key entity requirements.', color: 'text-purple-400' }
  ]
  if (phase === 'architecting') return [
    { id: 1, agent: 'ARCHITECT', text: 'Mapping component topology...', color: 'text-purple-400' },
    { id: 3, agent: 'PRODUCT_MGR', text: 'Reviewing architectural constraints.', color: 'text-emerald-400' }
  ]
  return [
    { id: 1, agent: 'PRODUCT_MGR', text: 'Generating Sprint backlog...', color: 'text-emerald-400' },
    { id: 2, agent: 'DEVELOPER', text: 'Provisioning local execution sandbox.', color: 'text-violet-400' },
    { id: 4, agent: 'DEVELOPER', text: 'Writing endpoint infrastructure.', color: 'text-violet-400' }
  ]
}

export function AgentFeed() {
  const { currentPhase } = useOrchestrationStore()
  const [logs, setLogs] = useState(getSimulatedLogs(currentPhase))

  useEffect(() => {
    setLogs(getSimulatedLogs(currentPhase))
  }, [currentPhase])

  return (
    <div className="w-80 h-full bg-[#040407]/95 backdrop-blur-3xl border-r border-white/5 flex flex-col shrink-0 z-10 shadow-[25px_0_50px_-20px_rgba(0,0,0,0.7)] relative">
      
      <div className="h-14 border-b border-white/5 flex items-center justify-between px-5 shrink-0 bg-white/[0.01]">
        <div className="flex items-center space-x-2">
          <TerminalSquare className="w-4 h-4 text-neutral-400" />
          <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 font-bold">
            Live Stream
          </h3>
        </div>
        <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
      </div>

      {/* Kinetic Stagger Scroll container */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-end space-y-4 overflow-x-hidden [&::-webkit-scrollbar]:hidden">
        <AnimatePresence mode="popLayout">
          {logs.map((log, index) => (
            <motion.div
              key={log.id + currentPhase}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.9, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              transition={{ 
                type: "spring", 
                stiffness: 140, 
                damping: 15,
                delay: index * 0.05 
              }}
              className="flex flex-col space-y-1.5 group cursor-pointer"
            >
              <div className="flex items-center justify-between opacity-60 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center space-x-2">
                  <span className={`text-[9px] font-mono uppercase tracking-widest font-bold ${log.color}`}>
                    {log.agent}
                  </span>
                  <span className="text-[9px] font-mono text-neutral-600">
                    [{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}]
                  </span>
                </div>
              </div>
              <div className="p-3.5 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 group-hover:border-white/10 rounded-xl text-xs text-neutral-300 font-sans leading-relaxed transition-all duration-300 shadow-lg group-hover:shadow-[0_0_20px_rgba(139,92,246,0.05)]">
                {log.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="h-[60px] border-t border-white/5 bg-black/40 p-3 shrink-0 flex items-center">
        <div className="w-full bg-white/[0.02] border border-white/5 rounded-lg px-3 py-2 text-[10px] font-mono text-neutral-600 flex items-center space-x-2">
          <span className="animate-pulse text-violet-400">_</span>
          <span>Feed is read-only...</span>
        </div>
      </div>
    </div>
  )
}