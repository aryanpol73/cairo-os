"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AgentSidebar } from "../agents/agent-sidebar"
import { AgentFeed } from "../agents/agent-feed"
import { useOrchestrationStore } from "../../store/useOrchestrationStore"
import { RefreshCw, Cpu, Columns3, Network, Terminal } from 'lucide-react'
import { ArchitectureGraph } from "../canvas/arch-graph"
import { SprintBoard } from "../canvas/sprint-board"
import { CodeTree } from "../canvas/code-tree"

type ViewTab = 'topology' | 'sprint' | 'code'

export function WorkspaceView() {
  const { currentPhase, prompt, resetEngine } = useOrchestrationStore()
  const [activeTab, setActiveTab] = useState<ViewTab>('topology')

  const tabs = [
    { id: 'topology', label: 'Architecture', icon: Network },
    { id: 'sprint', label: 'Sprint Planner', icon: Columns3 },
    { id: 'code', label: 'Implementation', icon: Terminal },
  ]

  return (
    <div className="fixed inset-0 z-50 flex h-screen w-screen bg-[#020203] text-white overflow-hidden select-none">
      
      {/* --- PREMIUM LIGHTING LAYER --- */}
      <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] pointer-events-none z-50" />
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-violet-600/[0.03] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/[0.02] blur-[120px] pointer-events-none" />

      <AgentSidebar />
      <AgentFeed />

      <div className="flex-1 h-full flex flex-col bg-gradient-to-b from-[#050508] to-[#020203] overflow-hidden relative z-10 border-l border-white/[0.02]">
        
        {/* Luxury Top Header Bar */}
        <div className="h-14 border-b border-white/[0.04] flex items-center justify-between px-6 bg-[#050508]/80 backdrop-blur-xl shrink-0">
          <div className="flex items-center space-x-4 max-w-xl">
            <div className="flex items-center space-x-1.5 bg-white/[0.02] border border-white/[0.05] px-2 py-1 rounded text-[11px] text-neutral-400 font-mono shadow-inner">
              <Cpu className="w-3 h-3 text-violet-400" />
              <span>FORGE_OS</span>
            </div>
            <span className="text-neutral-700 font-light">/</span>
            <div className="flex items-center space-x-2 truncate">
              <span className="text-xs text-neutral-500 font-mono shrink-0">Scope:</span>
              <span className="text-xs font-medium text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-neutral-500 truncate">
                {prompt}
              </span>
            </div>
          </div>

          <button
            onClick={resetEngine}
            className="group flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] text-xs font-mono text-neutral-400 hover:text-white transition-all duration-300 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
            <span>Re-Initialize</span>
          </button>
        </div>

        {/* Dynamic Center Stage Workspace */}
        <div className="flex-1 p-8 flex flex-col space-y-6 overflow-hidden">
          
          <div className="flex flex-row items-end justify-between px-2 shrink-0">
            {/* Title Area - Fixed Alignment and Wrapping */}
            <div className="flex flex-col space-y-1.5 pb-1">
              <h3 className="text-[9px] uppercase tracking-[0.3em] text-violet-500 font-mono font-bold">
                Simulation Workspace
              </h3>
              <div className="flex items-center space-x-3">
                <h2 className="text-xl md:text-2xl font-light text-white font-sans capitalize tracking-tight whitespace-nowrap">
                  {currentPhase} Pipeline
                </h2>
                {currentPhase !== 'idle' && (
                  <span className="flex h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse shrink-0" />
                )}
              </div>
            </div>
            
            {/* Master Tab Controller - Snapped to bottom right */}
            <div className="flex p-1 bg-[#020203] border border-white/[0.03] rounded-xl relative z-10 shadow-inner shrink-0">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as ViewTab)}
                    className={`relative flex items-center space-x-2 px-3 py-2 md:px-4 text-[9px] md:text-[10px] font-mono tracking-widest uppercase transition-colors duration-300 z-10 cursor-pointer ${
                      isActive ? 'text-white' : 'text-neutral-600 hover:text-neutral-400'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-violet-400' : 'text-neutral-700'}`} />
                    <span>{tab.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute inset-0 bg-white/[0.04] border border-white/[0.08] rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.02)] -z-10"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex-1 min-h-0 w-full rounded-2xl border border-white/[0.03] bg-[#020203]/50 p-[1px] relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,1)]">
            <AnimatePresence mode="wait">
              {activeTab === 'topology' && (
                <motion.div
                  key="topology"
                  initial={{ opacity: 0, scale: 0.99, filter: "blur(4px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.01, filter: "blur(4px)" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute inset-0 w-full h-full"
                >
                  <ArchitectureGraph />
                </motion.div>
              )}
              {activeTab === 'sprint' && (
                <motion.div
                  key="sprint"
                  initial={{ opacity: 0, scale: 0.99, filter: "blur(4px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.01, filter: "blur(4px)" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute inset-0 w-full h-full"
                >
                  <SprintBoard />
                </motion.div>
              )}
              {activeTab === 'code' && (
                <motion.div
                  key="code"
                  initial={{ opacity: 0, scale: 0.99, filter: "blur(4px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.01, filter: "blur(4px)" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute inset-0 w-full h-full"
                >
                  <CodeTree />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
        </div>
      </div>
    </div>
  )
}