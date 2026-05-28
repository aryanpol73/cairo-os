"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileCode, Folder, ChevronRight, ChevronDown, Terminal, Cpu, CheckCircle2, Braces } from 'lucide-react'

// Simulated code generation for the aesthetic
const codeSnippet = `import { AgentMatrix, Task } from '@cairo/core';
import { FastAPIGateway } from './infrastructure';

export class DeveloperAgent extends AgentMatrix {
  private readonly gateway = new FastAPIGateway();

  async executeTask(task: Task): Promise<void> {
    console.log(\`[Dev_Agent] Initializing implementation for: \${task.id}\`);
    
    // 1. Analyze topology requirements
    const AST = await this.parseSyntaxTree(task.context);
    
    // 2. Generate isomorphic endpoints
    await this.gateway.buildRoutes(AST.endpoints);
    
    // 3. Commit to memory buffer
    this.memory.commit('SUCCESS', task.id);
  }
}`

export function CodeTree() {
  const [activeLine, setActiveLine] = useState(0)

  // Simulates the agent typing / scanning down the file
  useEffect(() => {
    const lines = codeSnippet.split('\n').length
    const interval = setInterval(() => {
      setActiveLine((prev) => (prev + 1) % lines)
    }, 1200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full h-full flex bg-[#030305]/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
      
      {/* 1. Left Sidebar: File Explorer */}
      <div className="w-64 border-r border-white/5 bg-black/40 flex flex-col shrink-0">
        <div className="h-10 border-b border-white/5 flex items-center px-4 shrink-0">
          <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">Explorer</span>
        </div>
        
        {/* Hidden scrollbars */}
        <div className="p-3 space-y-1.5 font-mono text-[11px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          <div className="flex items-center space-x-2 text-neutral-300">
            <ChevronDown className="w-3 h-3 text-neutral-500" />
            <Folder className="w-3.5 h-3.5 text-violet-400" />
            <span>src</span>
          </div>
          
          <div className="pl-5 space-y-1.5">
            <div className="flex items-center space-x-2 text-neutral-300">
              <ChevronDown className="w-3 h-3 text-neutral-500" />
              <Folder className="w-3.5 h-3.5 text-sky-400" />
              <span>agents</span>
            </div>
            
            <div className="pl-5 space-y-1.5">
              <div className="flex items-center space-x-2 text-violet-300 bg-violet-500/10 px-2 py-1 rounded border border-violet-500/20">
                <FileCode className="w-3.5 h-3.5" />
                <span>developer.ts</span>
              </div>
              <div className="flex items-center space-x-2 text-neutral-500 hover:text-neutral-300 px-2 py-1 cursor-pointer transition-colors">
                <FileCode className="w-3.5 h-3.5" />
                <span>architect.ts</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-neutral-500 hover:text-neutral-300 transition-colors">
              <ChevronRight className="w-3 h-3" />
              <Folder className="w-3.5 h-3.5" />
              <span>api</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Editor Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#06060a]">
        
        {/* Editor Tabs - Badge cleanly integrated here */}
        <div className="h-10 bg-black/40 border-b border-white/5 flex items-center justify-between shrink-0 pr-4">
          <div className="flex items-center space-x-2 px-4 h-full bg-[#06060a] border-r border-white/5 border-t border-t-violet-500/30 text-[11px] font-mono text-neutral-200">
            <FileCode className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            <span className="truncate">developer.ts</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full">
            <Cpu className="w-3 h-3 text-violet-400 animate-pulse" />
            <span className="text-[9px] uppercase tracking-wider text-violet-300">Dev_Agent Active</span>
          </div>
        </div>

        {/* Code Canvas - Clean formatting with hidden scrollbars */}
        <div className="flex-1 p-4 overflow-auto font-mono text-[13px] leading-relaxed relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="text-neutral-400 min-w-max pb-4">
            {codeSnippet.split('\n').map((line, i) => (
              <div 
                key={i} 
                className={`flex space-x-4 px-2 py-0.5 rounded transition-colors duration-300 ${
                  i === activeLine ? 'bg-white/5 border-l-2 border-violet-400' : 'border-l-2 border-transparent'
                }`}
              >
                <span className="text-neutral-700 select-none w-4 text-right shrink-0">{i + 1}</span>
                <span className={`whitespace-pre ${
                  line.includes('import') || line.includes('export') || line.includes('class') || line.includes('async') 
                    ? 'text-violet-400' 
                    : line.includes('\'') || line.includes('\`')
                    ? 'text-emerald-400'
                    : line.includes('//')
                    ? 'text-neutral-500 italic'
                    : 'text-neutral-200'
                }`}>
                  {line || ' '}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Bottom Terminal Panel */}
        <div className="h-48 border-t border-white/5 bg-[#030305] flex flex-col shrink-0">
          <div className="flex items-center space-x-4 px-4 py-2 border-b border-white/5 shrink-0">
            <div className="flex items-center space-x-1.5 text-[10px] font-mono text-neutral-300 border-b-2 border-violet-400 pb-1">
              <Terminal className="w-3 h-3" />
              <span>AGENT_TERMINAL</span>
            </div>
            <div className="flex items-center space-x-1.5 text-[10px] font-mono text-neutral-600 pb-1">
              <Braces className="w-3 h-3" />
              <span>LINTER_OUTPUT</span>
            </div>
          </div>
          
          {/* Terminal Logs */}
          <div className="flex-1 p-3 font-mono text-[11px] overflow-y-auto space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex space-x-2 text-neutral-400">
              <span className="text-emerald-400 shrink-0">→</span>
              <span className="text-neutral-500 shrink-0">[14:02:01]</span>
              <span className="whitespace-nowrap">Spawning sandbox environment container...</span>
            </div>
            <div className="flex space-x-2 text-neutral-400">
              <span className="text-emerald-400 shrink-0">→</span>
              <span className="text-neutral-500 shrink-0">[14:02:03]</span>
              <span className="whitespace-nowrap">Installing dependencies: @cairo/core, fastapi...</span>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex space-x-2 text-violet-300"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />
              <span className="text-neutral-500 shrink-0">[14:02:05]</span>
              <span className="whitespace-nowrap">DeveloperAgent successfully compiled node graph edges.</span>
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  )
}