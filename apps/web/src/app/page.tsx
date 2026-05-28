"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Header } from '../components/core/header'
import { CommandInput } from '../components/core/command-input'
import { WorkspaceView } from '../components/core/workspace-view'
import { SystemStatus } from '../components/core/system-status'
import { useOrchestrationStore } from '../store/useOrchestrationStore'

export default function Home() {
  const { currentPhase } = useOrchestrationStore()

  return (
    <main className="min-h-screen bg-[#030305] text-white overflow-hidden selection:bg-violet-500/30 relative">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.02)_1px,transparent_0)] bg-[size:32px_32px] pointer-events-none" />
      
      <AnimatePresence mode="wait">
        {currentPhase === 'idle' ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0, filter: "blur(5px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ 
              opacity: 0,
              y: -20,
              filter: "blur(20px)",
              transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
            }}
            className="flex flex-col min-h-screen relative z-10 pb-12"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.1),transparent_50%)] pointer-events-none" />
            <Header />
            
            <div className="flex-1 flex flex-col items-center justify-center px-4 mt-12 md:mt-16">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-center space-y-6 mb-12 max-w-3xl"
              >
                <div className="inline-flex items-center space-x-2 bg-white/[0.02] border border-white/5 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-violet-300 shadow-2xl">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                  <span>MATRIX CONTAINER ACTIVE</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-extralight tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-200 to-neutral-500 font-sans leading-none">
                  The AI Software <br /> Implementation Matrix
                </h1>
                <p className="text-neutral-400 font-mono text-xs md:text-sm max-w-xl mx-auto leading-relaxed opacity-80">
                  Enter a system topology prompt. Watch the autonomous swarm design, plan, and compile architecture frameworks instantly.
                </p>
              </motion.div>

              <motion.div 
                layoutId="commandBarQuantum"
                transition={{ type: "spring", bounce: 0.08, duration: 0.7 }}
                className="w-full max-w-2xl relative z-20 shadow-[0_30px_100px_rgba(139,92,246,0.1)]"
              >
                <CommandInput />
              </motion.div>

              <SystemStatus />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="workspace"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            <WorkspaceView />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}