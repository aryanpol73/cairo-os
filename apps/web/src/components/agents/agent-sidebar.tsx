"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { useOrchestrationStore } from "../../store/useOrchestrationStore"
import { BrainCircuit, Code2, Columns3, ShieldCheck, Cpu, HardDrive } from 'lucide-react'

const agents = [
  { id: 'arch', name: 'Architect', icon: BrainCircuit, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', phase: 'architecting' },
  { id: 'pm', name: 'Product Mgr', icon: Columns3, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', phase: 'planning' },
  { id: 'dev', name: 'Developer', icon: Code2, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', phase: 'implementing' },
  { id: 'qa', name: 'QA Tester', icon: ShieldCheck, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20', phase: 'testing' },
]

export function AgentSidebar() {
  const { currentPhase } = useOrchestrationStore()

  return (
    <div className="w-64 h-full bg-[#030305]/80 backdrop-blur-3xl border-r border-white/5 flex flex-col shrink-0 z-20">
      
      {/* Header */}
      <div className="h-14 border-b border-white/5 flex items-center px-6 shrink-0">
        <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 font-bold">
          Active Swarm
        </h3>
      </div>

      {/* Agent Roster List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {agents.map((agent, i) => {
          
          // FIX: Cast to string to prevent TS literal mismatch panics
          const phaseString = currentPhase as string;
          const isActive = phaseString === agent.phase || (phaseString === 'architecting' && agent.phase === 'implementing') // Example fallback logic
          
          const Icon = agent.icon

          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-3 rounded-xl border transition-all duration-500 ${
                isActive ? 'border-white/10 bg-white/[0.03] shadow-lg' : 'border-white/5 bg-transparent opacity-60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg border ${isActive ? agent.bg : 'bg-white/5'} ${isActive ? agent.border : 'border-white/5'} relative`}>
                  {isActive && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${agent.bg.replace('/10', '')}`} />
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${agent.bg.replace('/10', '')}`} />
                    </span>
                  )}
                  <Icon className={`w-4 h-4 ${isActive ? agent.color : 'text-neutral-500'}`} />
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-neutral-200">{agent.name}</span>
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">
                    {isActive ? 'Executing...' : 'Standby'}
                  </span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* System Telemetry Footer */}
      <div className="p-4 border-t border-white/5 bg-black/40 space-y-3 shrink-0">
        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
          <div className="flex items-center space-x-1.5">
            <Cpu className="w-3 h-3 text-neutral-500" />
            <span>CORE_USE</span>
          </div>
          <span className="text-violet-400">84%</span>
        </div>
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-violet-500 w-[84%] rounded-full opacity-80" />
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 pt-2">
          <div className="flex items-center space-x-1.5">
            <HardDrive className="w-3 h-3 text-neutral-500" />
            <span>MEM_ALLOC</span>
          </div>
          <span className="text-emerald-400">2.4GB</span>
        </div>
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 w-[62%] rounded-full opacity-80" />
        </div>
      </div>

    </div>
  )
}