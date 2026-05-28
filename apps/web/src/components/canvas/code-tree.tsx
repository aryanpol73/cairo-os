"use client"

import React, { useState } from 'react'
import { useOrchestrationStore } from '../../store/useOrchestrationStore'
import { Code2, TerminalSquare, Copy, Check } from 'lucide-react'

export function CodeTree() {
  const { generatedCode, currentPhase } = useOrchestrationStore()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Loading state if the developer hasn't output code yet
  if (!generatedCode) {
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-center border border-dashed border-white/5 rounded-2xl bg-[#09090f]/40 p-12 text-center min-h-[40vh] mx-6 my-6">
        {currentPhase === 'error' ? (
          <>
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <span className="w-3 h-3 rounded-full bg-red-500" />
            </div>
            <p className="font-mono text-xs text-red-400 uppercase tracking-widest">Compilation Failed</p>
          </>
        ) : (
          <>
            <span className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="font-mono text-xs text-neutral-500 uppercase tracking-widest">
              {currentPhase === 'implementing' ? 'Developer compiling application files...' : 'Awaiting Developer Execution Block...'}
            </p>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="w-full h-full p-6 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full space-y-4">
        
        {/* IDE Header Menu */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
              <TerminalSquare className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <h2 className="text-xs font-mono text-neutral-200 uppercase tracking-widest">Compiled Source</h2>
              <p className="text-[10px] font-mono text-neutral-500 mt-0.5">main_architecture.py</p>
            </div>
          </div>
          
          <button 
            onClick={handleCopy}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />}
            <span className="text-[10px] font-mono text-neutral-400 group-hover:text-white transition-colors">
              {copied ? 'COPIED!' : 'COPY RAW'}
            </span>
          </button>
        </div>

        {/* IDE Code Block Area */}
        <div className="relative group rounded-xl border border-white/10 bg-[#020204] shadow-2xl overflow-hidden">
          {/* Mac OS Style window dots */}
          <div className="flex items-center space-x-2 px-4 py-3 border-b border-white/5 bg-[#060608]">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-4 text-[9px] font-mono text-neutral-600">workspace/src/generated_matrix.md</span>
          </div>
          
          <div className="p-4 overflow-x-auto">
            <pre className="text-[11px] font-mono text-neutral-300 whitespace-pre-wrap leading-relaxed selection:bg-violet-500/30">
              {generatedCode}
            </pre>
          </div>
        </div>

      </div>
    </div>
  )
}