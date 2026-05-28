"use client"

import React, { useState, useEffect } from 'react'
import { useOrchestrationStore } from '../../store/useOrchestrationStore'
import { BrainCircuit, LayoutList, Code2, ShieldCheck, Activity } from 'lucide-react'

export function SwarmSidebar() {
  const { currentPhase } = useOrchestrationStore()
  
  // Dynamic Hardware Metrics State
  const [metrics, setMetrics] = useState({ cpu: 12, ram: 1.4 })

  // Hardware Simulation Effect: Spikes when active, drops when idle
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentPhase !== 'idle' && currentPhase !== 'stable' && currentPhase !== 'error') {
        // High load during active agent execution
        setMetrics({
          cpu: Math.floor(75 + Math.random() * 20),
          ram: Number((2.8 + Math.random() * 1.5).toFixed(1))
        })
      } else {
        // Idle load
        setMetrics({
          cpu: Math.floor(8 + Math.random() * 6),
          ram: Number((1.2 + Math.random() * 0.3).toFixed(1))
        })
      }
    }, 1500)
    return () => clearInterval(interval)
  }, [currentPhase])

  const getAgentState = (targetPhases: string[], donePhases: string[]) => {
    if (currentPhase === 'error') return { text: 'SYSTEM FAULT', textColor: 'text-red-400', dot: 'bg-red-500 animate-pulse', border: 'border-red-500/30' }
    if (donePhases.includes(currentPhase)) return { text: 'COMPLETED', textColor: 'text-emerald-400', dot: 'bg-emerald-500', border: 'border-emerald-500/20 bg-emerald-500/5' }
    if (targetPhases.includes(currentPhase)) return { text: 'PROCESSING...', textColor: 'text-violet-400', dot: 'bg-violet-500 animate-ping', border: 'border-violet-500/50 bg-violet-500/5' }
    return { text: 'STANDBY', textColor: 'text-neutral-600', dot: 'bg-neutral-700', border: 'border-white/5' }
  }

  const agents = [
    { id: 'Architect', icon: BrainCircuit, state: getAgentState(['discovery', 'architecting'], ['planning', 'implementing', 'testing', 'stable']) },
    { id: 'Product Mgr', icon: LayoutList, state: getAgentState(['planning'], ['implementing', 'testing', 'stable']) },
    { id: 'Developer', icon: Code2, state: getAgentState(['implementing'], ['testing', 'stable']) },
    { id: 'QA Tester', icon: ShieldCheck, state: getAgentState(['testing'], ['stable']) }
  ]

  const getGlobalStatus = () => {
    if (currentPhase === 'error') return { color: 'text-red-400', text: 'OFFLINE / ERROR' }
    if (currentPhase === 'stable') return { color: 'text-emerald-400', text: 'PIPELINE STABLE' }
    if (currentPhase !== 'idle') return { color: 'text-violet-400', text: 'PIPELINE ACTIVE' }
    return { color: 'text-neutral-500', text: 'SYSTEM IDLE' }
  }

  const globalStatus = getGlobalStatus()

  return (
    <div className="w-full h-full p-4 flex flex-col border-r border-white/5 bg-[#040406]">
      <div className="flex items-center justify-between mb-6 px-2">
        <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">Active Swarm</span>
        <div className="flex items-center space-x-2">
          <span className={`text-[9px] font-mono uppercase tracking-wider ${globalStatus.color}`}>{globalStatus.text}</span>
          <Activity className={`w-3.5 h-3.5 ${globalStatus.color}`} />
        </div>
      </div>

      <div className="flex-1 space-y-3">
        {agents.map((agent) => {
          const Icon = agent.icon
          return (
            <div key={agent.id} className={`p-4 rounded-xl border transition-all duration-300 ${agent.state.border}`}>
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-white/5">
                  <Icon className={`w-5 h-5 ${agent.state.textColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-semibold text-neutral-200 tracking-wide">{agent.id}</h3>
                  <div className="flex items-center space-x-1.5 mt-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${agent.state.dot}`} />
                    <span className={`text-[9px] font-mono uppercase tracking-wider ${agent.state.textColor}`}>
                      {agent.state.text}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Dynamic System Metrics Footer */}
      <div className="mt-auto p-4 border-t border-white/5 space-y-4">
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-mono">
            <span className="text-neutral-500 uppercase tracking-wider">Core_Use</span>
            <span className="text-violet-400 transition-all duration-500">{metrics.cpu}%</span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-violet-500 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${metrics.cpu}%` }} 
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-mono">
            <span className="text-neutral-500 uppercase tracking-wider">Mem_Alloc</span>
            <span className="text-emerald-400 transition-all duration-500">{metrics.ram}GB</span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${(metrics.ram / 8) * 100}%` }} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}