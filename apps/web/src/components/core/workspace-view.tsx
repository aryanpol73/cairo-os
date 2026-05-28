"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
// Fixed import path to point to your src/hooks folder
import { useWebSocket } from '../../hooks/use-websocket'
import { SwarmSidebar } from './swarm-sidebar'
import { AgentFeed } from "../agents/agent-feed"
import { HistorySidebar } from './history-sidebar'
import { useOrchestrationStore } from "../../store/useOrchestrationStore"
import { RefreshCw, Cpu, Columns3, Network, Terminal, ShieldCheck, Menu, X, Users, Activity, Layers, Sparkles, Send, Database } from 'lucide-react'
import { ArchitectureGraph } from "../canvas/arch-graph"
import { SprintBoard } from "../canvas/sprint-board"
import { CodeTree } from "../canvas/code-tree"
import { QARunner } from "../canvas/qa-runner"

type CanvasTab = 'topology' | 'sprint' | 'code' | 'qa'
type MobileTab = 'swarm' | 'canvas' | 'stream'
type DesktopDrawer = 'none' | 'swarm' | 'stream' | 'history'

export function WorkspaceView() {
  // Added updateFromBackend to the destructuring
  const { currentPhase, prompt: globalPrompt, initializeEngine, submitFeedback, resetEngine, updateFromBackend } = useOrchestrationStore()
  
  // Added : any type to data to fix the implicit 'any' error
  useWebSocket((data: any) => {
    console.log("[WORKSPACE] Incoming data:", data);
    updateFromBackend(data);
  });

  // Navigation States
  const [localInput, setLocalInput] = useState('')
  const [canvasTab, setCanvasTab] = useState<CanvasTab>('topology')
  const [mobileTab, setMobileTab] = useState<MobileTab>('canvas')
  const [desktopDrawer, setDesktopDrawer] = useState<DesktopDrawer>('none')

  // Automatically switch tabs based on backend phase
  useEffect(() => {
    if (currentPhase === 'architecting') { setCanvasTab('topology'); setMobileTab('canvas') } 
    else if (currentPhase === 'planning') { setCanvasTab('sprint'); setMobileTab('canvas') } 
    else if (currentPhase === 'implementing') { setCanvasTab('code'); setMobileTab('canvas') } 
    else if (currentPhase === 'testing') { setCanvasTab('qa'); setMobileTab('canvas') }
  }, [currentPhase])

  // Smart Form Handler: Initializes OR Refactors based on state
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!localInput.trim()) return

    if (currentPhase === 'stable') {
      submitFeedback(localInput)
      setLocalInput('') // Clear input after sending feedback
    } else {
      initializeEngine(localInput)
    }
  }

  const canvasTabs = [
    { id: 'topology', label: 'Arch', icon: Network },
    { id: 'sprint', label: 'Sprint', icon: Columns3 },
    { id: 'code', label: 'Code', icon: Terminal },
    { id: 'qa', label: 'QA Test', icon: ShieldCheck },
  ]

  const isInputDisabled = currentPhase !== 'idle' && currentPhase !== 'stable' && currentPhase !== 'error'

  return (
    <div className="fixed inset-0 z-50 flex flex-col h-[100dvh] w-screen bg-[#030305] text-white overflow-hidden select-none font-sans">
      
      {/* Background Aura */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-gradient-to-br from-[#05030a] via-[#020203] to-[#0a0512]">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-violet-600/15 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-fuchsia-600/10 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-[10000ms]" />
        <div className="absolute inset-0 opacity-[0.25] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex absolute top-6 left-6 right-6 h-16 bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-2xl items-center justify-between px-4 z-40 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]">
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setDesktopDrawer(desktopDrawer === 'swarm' ? 'none' : 'swarm')}
            className={`p-2.5 rounded-xl transition-all duration-300 ${desktopDrawer === 'swarm' ? 'bg-violet-500/20 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white'}`}
          >
            {desktopDrawer === 'swarm' ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          {/* Smart Input Form */}
          <form onSubmit={handleSubmit} className="relative w-96 flex items-center">
            <div className={`absolute left-3 p-1.5 rounded-lg ${currentPhase === 'stable' ? 'bg-emerald-500/20' : 'bg-violet-500/20'}`}>
              <Sparkles className={`w-3.5 h-3.5 ${currentPhase === 'stable' ? 'text-emerald-400' : 'text-violet-400'}`} />
            </div>
            <input 
              type="text"
              value={localInput}
              onChange={(e) => setLocalInput(e.target.value)}
              placeholder={currentPhase === 'stable' ? "Pipeline Stable. Request an edit or feature..." : "Describe your application scope..."}
              disabled={isInputDisabled}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-11 pr-12 text-xs font-medium text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-violet-500/50 transition-all disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={!localInput.trim() || isInputDisabled}
              className="absolute right-2 p-1.5 bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Center Canvas Tabs */}
        <div className="flex p-1 bg-black/40 border border-white/10 rounded-xl shadow-inner">
          {canvasTabs.map((tab) => {
            const isActive = canvasTab === tab.id
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setCanvasTab(tab.id as CanvasTab)}
                className={`relative flex items-center space-x-2 px-4 py-1.5 text-[11px] font-mono tracking-widest uppercase transition-colors duration-300 z-10 ${isActive ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-violet-400' : 'text-neutral-600'}`} />
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div layoutId="desktopTabIndicator" className="absolute inset-0 bg-white/[0.06] border border-white/[0.1] rounded-lg shadow-[0_0_20px_rgba(139,92,246,0.15)] -z-10" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                )}
              </button>
            )
          })}
        </div>

        {/* Right Menu */}
        <div className="flex items-center space-x-3">
          <button onClick={resetEngine} className="px-3 py-1.5 rounded-lg hover:bg-white/5 text-[11px] font-mono text-neutral-500 hover:text-white transition-colors flex items-center space-x-2">
            <RefreshCw className="w-3 h-3" />
            <span>Reset</span>
          </button>

          <button 
            onClick={() => setDesktopDrawer(desktopDrawer === 'history' ? 'none' : 'history')}
            className={`p-2.5 rounded-xl transition-all duration-300 ${desktopDrawer === 'history' ? 'bg-violet-500/20 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white'}`}
          >
            <Database className="w-5 h-5" />
          </button>

          <button 
            onClick={() => setDesktopDrawer(desktopDrawer === 'stream' ? 'none' : 'stream')}
            className={`p-2.5 rounded-xl transition-all duration-300 relative ${desktopDrawer === 'stream' ? 'bg-violet-500/20 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white'}`}
          >
            {desktopDrawer === 'stream' ? <X className="w-5 h-5" /> : <Terminal className="w-5 h-5" />}
            {currentPhase !== 'idle' && currentPhase !== 'stable' && <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}
          </button>
        </div>
      </div>

      {/* Drawers */}
      <AnimatePresence>
        {desktopDrawer !== 'none' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setDesktopDrawer('none')}
            className="hidden md:block fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>
      
      <div className={`hidden md:block fixed top-28 bottom-6 left-6 w-80 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${desktopDrawer === 'swarm' ? 'translate-x-0 opacity-100' : '-translate-x-[120%] opacity-0 pointer-events-none'}`}>
        <div className="h-full rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10">
          <SwarmSidebar />
        </div>
      </div>

      <div className={`hidden md:block fixed top-28 bottom-6 left-6 w-80 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${desktopDrawer === 'history' ? 'translate-x-0 opacity-100' : '-translate-x-[120%] opacity-0 pointer-events-none'}`}>
        <div className="h-full rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10">
          <HistorySidebar />
        </div>
      </div>

      <div className={`hidden md:block fixed top-28 bottom-6 right-6 w-96 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${desktopDrawer === 'stream' ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0 pointer-events-none'}`}>
        <div className="h-full rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10">
          <AgentFeed />
        </div>
      </div>

      {/* Canvas Renderer */}
      <div className="relative flex-1 w-full h-full md:pt-28 md:pb-6 md:px-6 z-10 flex flex-col">
        <div className="flex-1 w-full relative bg-black/20 md:bg-black/40 backdrop-blur-xl md:rounded-2xl md:border md:border-white/10 overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div 
              key={`canvas-${canvasTab}`} 
              initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }} 
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} 
              exit={{ opacity: 0, scale: 1.02, filter: "blur(4px)" }} 
              transition={{ duration: 0.3, ease: "easeOut" }} 
              className="absolute inset-0 w-full h-full p-[1px]"
            >
              {canvasTab === 'topology' && <ArchitectureGraph />}
              {canvasTab === 'sprint' && <SprintBoard />}
              {canvasTab === 'code' && <CodeTree />}
              {canvasTab === 'qa' && <QARunner />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden bg-[#050508]/95 backdrop-blur-3xl border-t border-white/10 pb-safe pt-2 px-4 shrink-0 z-50">
        <div className="flex items-center justify-around h-16 pb-2">
          <button onClick={() => setMobileTab('canvas')} className={`flex flex-col items-center space-y-1.5 w-20 transition-colors ${mobileTab === 'canvas' ? 'text-violet-400' : 'text-neutral-500 hover:text-neutral-300'}`}>
            <Layers className={`w-5 h-5 ${mobileTab === 'canvas' ? 'drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]' : ''}`} />
            <span className="text-[10px] font-medium tracking-wide">Workspace</span>
            {mobileTab === 'canvas' && <span className="w-1 h-1 rounded-full bg-violet-400 mt-1" />}
          </button>
          <button onClick={() => setMobileTab('swarm')} className={`flex flex-col items-center space-y-1.5 w-20 transition-colors ${mobileTab === 'swarm' ? 'text-violet-400' : 'text-neutral-500 hover:text-neutral-300'}`}>
            <Users className={`w-5 h-5 ${mobileTab === 'swarm' ? 'drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]' : ''}`} />
            <span className="text-[10px] font-medium tracking-wide">Swarm</span>
            {mobileTab === 'swarm' && <span className="w-1 h-1 rounded-full bg-violet-400 mt-1" />}
          </button>
          <button onClick={() => setMobileTab('stream')} className={`flex flex-col items-center space-y-1.5 w-20 transition-colors relative ${mobileTab === 'stream' ? 'text-violet-400' : 'text-neutral-500 hover:text-neutral-300'}`}>
            <Activity className={`w-5 h-5 ${mobileTab === 'stream' ? 'drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]' : ''}`} />
            <span className="text-[10px] font-medium tracking-wide">Logs</span>
            {currentPhase !== 'idle' && mobileTab !== 'stream' && <span className="absolute top-0 right-5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse border border-black" />}
            {mobileTab === 'stream' && <span className="w-1 h-1 rounded-full bg-violet-400 mt-1" />}
          </button>
        </div>
      </div>

    </div>
  )
}