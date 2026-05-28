"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, CornerDownLeft } from 'lucide-react'
import { useOrchestrationStore } from "../../store/useOrchestrationStore"

export function CommandInput() {
  const [inputValue, setInputValue] = useState('')
  const { startEngine, setPrompt, isEngineActive } = useOrchestrationStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    setPrompt(inputValue)
    startEngine()
  }

  return (
    <div className="w-full px-4 group">
      <form onSubmit={handleSubmit} className="relative">
        
        {/* Outer Glow & Gradient Border Wrapper */}
        <div className="relative p-[1px] rounded-2xl bg-gradient-to-b from-white/15 via-white/5 to-transparent shadow-[0_8px_32px_-10px_rgba(14,10,35,0.5)] transition-all duration-500 group-focus-within:from-violet-500/30 group-focus-within:via-white/10 group-focus-within:shadow-[0_0_40px_-10px_rgba(139,92,246,0.25)]">
          
          {/* Inner Glass Input Base */}
          <div className="relative flex items-center h-16 w-full rounded-[15px] bg-[#09090e]/80 backdrop-blur-2xl px-5">
            
            <Sparkles className="w-5 h-5 text-violet-400/70 mr-4 shrink-0 transition-colors group-focus-within:text-violet-400" />
            
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isEngineActive}
              placeholder="Describe an app, startup concept, or architectural feature..."
              className="w-full bg-transparent text-[15px] text-white placeholder-neutral-500 outline-none border-none focus:ring-0 disabled:opacity-50 tracking-wide"
            />

            <div className="flex items-center space-x-3 shrink-0">
              <AnimatePresence mode="popLayout">
                {inputValue.length > 0 && !isEngineActive && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.95, filter: "blur(6px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.95, filter: "blur(6px)" }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    type="submit"
                    className="relative flex items-center justify-center h-9 px-4 rounded-xl font-mono text-[11px] font-semibold tracking-wider uppercase overflow-hidden group/btn cursor-pointer transition-all duration-300"
                  >
                    {/* Layer 1: Ambient Outer Radial Pulsing Glow */}
                    <div className="absolute inset-0 bg-violet-600/20 blur-md rounded-xl opacity-50 group-hover/btn:opacity-100 group-hover/btn:bg-violet-500/30 transition-all duration-500" />

                    {/* Layer 2: Refractive 1px Border Frame Wrapper */}
                    <div className="absolute inset-0 p-[1px] rounded-xl bg-gradient-to-b from-white/20 via-violet-500/20 to-transparent group-hover/btn:from-violet-400/40 group-hover/btn:via-violet-500/30">
                      {/* Layer 3: Liquid Glass Core Dark Mirror Background */}
                      <div className="w-full h-full rounded-[11px] bg-gradient-to-b from-[#16122c] to-[#0c0a1a] transition-all duration-300 group-hover/btn:from-[#1c163a] group-hover/btn:to-[#0f0c24]" />
                    </div>

                    {/* Layer 4: Interactive Content Elements */}
                    <span className="relative z-10 flex items-center space-x-1.5 text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 via-white to-violet-200 group-hover/btn:from-white group-hover/btn:to-violet-300 transition-colors duration-300">
                      <span>Initialize</span>
                      <ArrowRight className="w-3.5 h-3.5 text-violet-400 group-hover/btn:translate-x-0.5 transition-transform duration-300" />
                    </span>
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Enter Key Hint */}
              <span className="hidden sm:flex items-center text-[10px] tracking-widest text-neutral-500 border border-white/5 bg-white/[0.02] px-2 py-1 rounded shadow-inner uppercase font-mono transition-opacity group-focus-within:opacity-0">
                <span>Enter</span>
                <CornerDownLeft className="w-3 h-3 ml-1.5 opacity-70" />
              </span>
            </div>

          </div>
        </div>
      </form>
      
      <div className="mt-6 flex justify-center space-x-6 text-[11px] font-mono tracking-wider text-neutral-500/70">
        <span className="hover:text-violet-400 transition-colors cursor-pointer">Try: &ldquo;Real-time B2B metrics dashboard&rdquo;</span>
        <span>•</span>
        <span className="hover:text-violet-400 transition-colors cursor-pointer">&ldquo;AI fitness app for students&rdquo;</span>
      </div>
    </div>
  )
}