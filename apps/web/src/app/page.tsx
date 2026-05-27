"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Header } from '../components/core/header'
import { CommandInput } from '../components/core/command-input'
import { WorkspaceView } from '../components/core/workspace-view'
import { useOrchestrationStore } from '../store/useOrchestrationStore'

export default function Home() {
  const { currentPhase } = useOrchestrationStore()

  return (
    <main className="min-h-screen bg-[#030305] text-white overflow-hidden selection:bg-violet-500/30">
      <AnimatePresence mode="wait">
        
        {currentPhase === 'idle' ? (
          /* --- THE LANDING PAGE STATE --- */
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col min-h-screen relative z-10"
          >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,82,238,0.15),transparent_50%)] pointer-events-none" />
            
            <Header />
            
            <div className="flex-1 flex flex-col items-center justify-center px-4 -mt-20">
              <div className="text-center space-y-6 mb-12 max-w-3xl">
                <div className="inline-flex items-center space-x-2 bg-white/[0.03] border border-white/5 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-violet-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                  <span>v1.0.0 Online</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-light tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500 font-sans">
                  The AI Software <br className="hidden md:block" /> Implementation Matrix
                </h1>
                <p className="text-neutral-400 font-mono text-sm max-w-xl mx-auto leading-relaxed">
                  Enter a system topology prompt. Watch the autonomous swarm design, plan, and compile the architecture in real-time.
                </p>
              </div>

              <div className="w-full max-w-2xl relative z-20">
                <CommandInput />
              </div>
            </div>
          </motion.div>
        ) : (
          
          /* --- THE MATRIX WORKSPACE STATE --- */
          <motion.div
            key="workspace"
            initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50"
          >
            <WorkspaceView />
          </motion.div>
          
        )}
      </AnimatePresence>
    </main>
  )
}