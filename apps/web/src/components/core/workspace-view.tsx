"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AgentSidebar } from "../agents/agent-sidebar"
import { AgentFeed } from "../agents/agent-feed"
import { useOrchestrationStore } from "../../store/useOrchestrationStore"
import { RefreshCw, Cpu, Columns3, Network, Terminal, ShieldCheck, Menu, X, Users, Activity, Layers, Sparkles } from 'lucide-react'
import { ArchitectureGraph } from "../canvas/arch-graph"
import { SprintBoard } from "../canvas/sprint-board"
import { CodeTree } from "../canvas/code-tree"
import { QARunner } from "../canvas/qa-runner"

type CanvasTab = 'topology' | 'sprint' | 'code' | 'qa'
type MobileTab = 'swarm' | 'canvas' | 'stream'
type DesktopDrawer = 'none' | 'swarm' | 'stream'

export function WorkspaceView() {
  const { currentPhase, prompt, resetEngine } = useOrchestrationStore()
  
  // Navigation States
  const [canvasTab, setCanvasTab] = useState<CanvasTab>('topology')
  const [mobileTab, setMobileTab] = useState<MobileTab>('canvas')
  const [desktopDrawer, setDesktopDrawer] = useState<DesktopDrawer>('none')

  const canvasTabs = [
    { id: 'topology', label: 'Arch', icon: Network },
    { id: 'sprint', label: 'Sprint', icon: Columns3 },
    { id: 'code', label: 'Code', icon: Terminal },
    { id: 'qa', label: 'QA Test', icon: ShieldCheck },
  ]

  return (
    <div className="fixed inset-0 z-50 flex flex-col h-[100dvh] w-screen bg-[#030305] text-white overflow-hidden select-none font-sans">
      
      {/* ========================================================= */}
      {/* 1. DYNAMIC VIBE & AURA BACKGROUND (Matches Front Page)    */}
      {/* ========================================================= */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-gradient-to-br from-[#05030a] via-[#020203] to-[#0a0512]">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-violet-600/15 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-fuchsia-600/10 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-[10000ms]" />
        <div className="absolute inset-0 opacity-[0.25] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      </div>

      {/* ========================================================= */}
      {/* 2. DESKTOP FLOATING HEADER (Hidden on Mobile)             */}
      {/* ========================================================= */}
      <div className="hidden md:flex absolute top-6 left-6 right-6 h-16 bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-2xl items-center justify-between px-4 z-40 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]">
        
        {/* Left: Hamburger Menu -> Opens Swarm */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setDesktopDrawer(desktopDrawer === 'swarm' ? 'none' : 'swarm')}
            className={`p-2.5 rounded-xl transition-all duration-300 ${desktopDrawer === 'swarm' ? 'bg-violet-500/20 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white'}`}
          >
            {desktopDrawer === 'swarm' ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center space-x-2 bg-black/40 border border-white/5 px-3 py-1.5 rounded-lg">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <div className="flex flex-col">
              <span className="text-[9px] text-neutral-500 font-mono leading-none">SCOPE</span>
              <span className="text-xs font-medium text-neutral-200 truncate max-w-[200px] leading-none mt-0.5">{prompt || "No Scope"}</span>
            </div>
          </div>
        </div>

        {/* Center: Canvas Tabs (The Core Features) */}
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

        {/* Right: Terminal Menu -> Opens Live Logs */}
        <div className="flex items-center space-x-3">
          <button onClick={resetEngine} className="px-3 py-1.5 rounded-lg hover:bg-white/5 text-[11px] font-mono text-neutral-500 hover:text-white transition-colors flex items-center space-x-2">
            <RefreshCw className="w-3 h-3" />
            <span>Reset</span>
          </button>
          <button 
            onClick={() => setDesktopDrawer(desktopDrawer === 'stream' ? 'none' : 'stream')}
            className={`p-2.5 rounded-xl transition-all duration-300 relative ${desktopDrawer === 'stream' ? 'bg-violet-500/20 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white'}`}
          >
            {desktopDrawer === 'stream' ? <X className="w-5 h-5" /> : <Terminal className="w-5 h-5" />}
            {currentPhase !== 'idle' && <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. DESKTOP SLIDING DRAWERS (Glass Overlays)               */}
      {/* ========================================================= */}
      <AnimatePresence>
        {desktopDrawer !== 'none' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setDesktopDrawer('none')}
            className="hidden md:block fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>
      
      {/* Left Drawer: Swarm Roster */}
      <div className={`hidden md:block fixed top-28 bottom-6 left-6 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${desktopDrawer === 'swarm' ? 'translate-x-0 opacity-100' : '-translate-x-[120%] opacity-0 pointer-events-none'}`}>
        <div className="h-full rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10">
          <AgentSidebar />
        </div>
      </div>

      {/* Right Drawer: Live Stream Logs */}
      <div className={`hidden md:block fixed top-28 bottom-6 right-6 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${desktopDrawer === 'stream' ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0 pointer-events-none'}`}>
        <div className="h-full rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10">
          <AgentFeed />
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. MAIN WORKSPACE / CANVAS AREA                           */}
      {/* ========================================================= */}
      <div className="relative flex-1 w-full h-full md:pt-28 md:pb-6 md:px-6 z-10 flex flex-col">
        
        {/* MOBILE TOP HEADER (Hidden on Desktop) */}
        <div className="md:hidden flex items-center justify-between p-4 bg-black/20 backdrop-blur-md border-b border-white/5 shrink-0">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-violet-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-400 font-mono font-bold leading-tight tracking-widest">{currentPhase.toUpperCase()} PIPELINE</span>
              <span className="text-[10px] text-neutral-500 font-sans leading-tight truncate max-w-[200px]">{prompt || "System Idle"}</span>
            </div>
          </div>
          <button onClick={resetEngine} className="p-2 bg-white/5 rounded-lg text-neutral-400 active:scale-95 transition-transform"><RefreshCw className="w-4 h-4" /></button>
        </div>

        {/* MOBILE CANVAS TABS (Only shows when 'Canvas' is selected on bottom nav) */}
        {mobileTab === 'canvas' && (
          <div className="md:hidden flex p-2 bg-black/40 border-b border-white/5 shrink-0 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {canvasTabs.map((tab) => {
              const isActive = canvasTab === tab.id
              return (
                <button
                  key={tab.id} onClick={() => setCanvasTab(tab.id as CanvasTab)}
                  className={`relative flex items-center space-x-2 px-4 py-2 text-[10px] font-mono tracking-widest uppercase shrink-0 transition-colors ${isActive ? 'text-white' : 'text-neutral-500'}`}
                >
                  <tab.icon className={`w-3.5 h-3.5 ${isActive ? 'text-violet-400' : 'text-neutral-600'}`} />
                  <span>{tab.label}</span>
                  {isActive && <motion.div layoutId="mobileTabIndicator" className="absolute inset-0 bg-white/5 border border-white/10 rounded-lg -z-10" />}
                </button>
              )
            })}
          </div>
        )}

        {/* THE VIEW RENDERER - Fixed multi-child warning by grouping logic */}
        <div className="flex-1 w-full relative bg-black/20 md:bg-black/40 backdrop-blur-xl md:rounded-2xl md:border md:border-white/10 overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            
            {/* 1. Mobile View Overrides: Swarm Tab */}
            {mobileTab === 'swarm' ? (
              <motion.div 
                key="mobile-swarm" 
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 1.02 }} 
                transition={{ duration: 0.25 }} 
                className="absolute inset-0 w-full h-full p-0 md:hidden [&>div]:!w-full [&>div]:!h-full [&>div]:!border-none [&>div]:!rounded-none"
              >
                <AgentSidebar />
              </motion.div>
            ) : mobileTab === 'stream' ? (
              /* 2. Mobile View Overrides: Logs Tab */
              <motion.div 
                key="mobile-stream" 
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 1.02 }} 
                transition={{ duration: 0.25 }} 
                className="absolute inset-0 w-full h-full p-0 md:hidden [&>div]:!w-full [&>div]:!h-full [&>div]:!border-none [&>div]:!rounded-none"
              >
                <AgentFeed />
              </motion.div>
            ) : (
              /* 3. Core Workspace Canvas (Desktop Master & Mobile 'Workspace' Tab) */
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
            )}
            
          </AnimatePresence>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. MOBILE BOTTOM NAVIGATION (Hidden on Desktop)           */}
      {/* ========================================================= */}
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