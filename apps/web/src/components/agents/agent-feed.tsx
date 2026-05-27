"use client"

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOrchestrationStore } from "../../store/useOrchestrationStore"
import { TerminalSquare, Activity } from 'lucide-react'

// Simulated logs for aesthetic purposes based on phase
const getSimulatedLogs = (phase: string) => {
  if (phase === 'idle') return [{ id: 1, agent: 'SYSTEM', text: 'Awaiting initialization prompt...', color: 'text-neutral-500' }]
  if (phase === 'discovery') return [
    { id: 1, agent: 'ARCHITECT', text: 'Analyzing scope parameters...', color: 'text-purple-400' },
    { id: 2, agent: 'ARCHITECT', text: 'Extracting key entity requirements.', color: 'text-purple-400' }
  ]
  if (phase === 'architecting') return [
    { id: 1, agent: 'ARCHITECT', text: 'Mapping component topology...', color: 'text-purple-400' },
    { id: 2, agent: 'SYSTEM', text: 'Node graph visualization unlocked.', color: 'text-neutral-400' },
    { id: 3, agent: 'PRODUCT_MGR', text: 'Reviewing architectural constraints.', color: 'text-emerald-400' }
  ]
  return [
    { id: 1, agent: 'PRODUCT_MGR', text: 'Generating Sprint backlog...', color: 'text-emerald-400' },
    { id: 2, agent: 'DEVELOPER', text: 'Provisioning local execution sandbox.', color: 'text-violet-400' },
    { id: 3, agent: 'DEVELOPER', text: 'Writing endpoint infrastructure.', color: 'text-violet-400' }
  ]
}

export function AgentFeed() {
  const { currentPhase } = useOrchestrationStore()
  const [logs, setLogs] = useState(getSimulatedLogs(currentPhase))

  // Update logs when phase changes
  useEffect(() => {
    setLogs(getSimulatedLogs(currentPhase))
  }, [currentPhase])

  return (
    <div className="w-80 h-full bg-[#06060a]/90 backdrop-blur-2xl border-r border-white/5 flex flex-col shrink-0 z-10 shadow-[20px_0_40px_-20px_rgba(0,0,0,0.5)]">
      
      {/* Header */}
      <div className="h-14 border-b border-white/5 flex items-center justify-between px-5 shrink-0 bg-white/[0.01]">
        <div className="flex items-center space-x-2">
          <TerminalSquare className="w-4 h-4 text-neutral-400" />
          <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 font-bold">
            Live Stream
          </h3>
        </div>
        <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
      </div>

      {/* Live Log Container */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-end space-y-4">
        <AnimatePresence mode="popLayout">
          {logs.map((log) => (
            <motion.div
              key={log.id + currentPhase}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col space-y-1.5"
            >
              <div className="flex items-center space-x-2">
                <span className={`text-[9px] font-mono uppercase tracking-widest font-bold ${log.color}`}>
                  {log.agent}
                </span>
                <span className="text-[9px] font-mono text-neutral-600">
                  [{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}]
                </span>
              </div>
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-xs text-neutral-300 font-sans leading-relaxed">
                {log.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Fade out gradient at bottom of logs to look clean */}
      <div className="h-4 w-full bg-gradient-to-t from-[#06060a]/90 to-transparent absolute bottom-[60px]" pointer-events-none="true" />
      
      {/* Static Footer input aesthetic */}
      <div className="h-[60px] border-t border-white/5 bg-black/20 p-3 shrink-0 flex items-center">
        <div className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 text-[10px] font-mono text-neutral-600 flex items-center space-x-2">
          <span className="animate-pulse text-violet-400">_</span>
          <span>Feed is read-only...</span>
        </div>
      </div>

    </div>
  )
}