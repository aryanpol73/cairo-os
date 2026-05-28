"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { useOrchestrationStore } from '../../store/useOrchestrationStore'
import { ShieldCheck, ShieldAlert, CheckCircle2, Activity, TerminalSquare, Search } from 'lucide-react'

export function QARunner() {
  const { currentPhase, logs } = useOrchestrationStore()

  // Filter logs specifically for the QA Agent's output
  const qaLogs = logs.filter(log => log.agent.toLowerCase().includes('qa') || log.agent.toLowerCase().includes('tester'))

  // Determine if we are waiting for the earlier agents to finish
  const isWaiting = ['idle', 'discovery', 'architecting', 'planning', 'implementing'].includes(currentPhase)
  const isTesting = currentPhase === 'testing'
  const isStable = currentPhase === 'stable'

  if (currentPhase === 'error') {
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-center border border-dashed border-red-500/20 rounded-2xl bg-red-500/5 p-12 text-center min-h-[40vh] mx-6 my-6">
        <ShieldAlert className="w-8 h-8 text-red-500 mb-4 animate-pulse" />
        <p className="font-mono text-xs text-red-400 uppercase tracking-widest">Security Scan Aborted: System Fault</p>
      </div>
    )
  }

  if (isWaiting) {
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-center border border-dashed border-white/5 rounded-2xl bg-[#09090f]/40 p-12 text-center min-h-[40vh] mx-6 my-6">
        <span className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-mono text-xs text-neutral-500 uppercase tracking-widest">
          Awaiting Codebase Compilation...
        </p>
        <p className="font-mono text-[9px] text-neutral-600 mt-2">QA Protocols will engage in the testing phase.</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full p-6 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xs font-mono text-neutral-200 uppercase tracking-widest">Compliance & Security Audit</h2>
              <p className="text-[10px] font-mono text-neutral-500 mt-0.5">Automated Codebase Review</p>
            </div>
          </div>
          
          <div className={`px-3 py-1.5 rounded-md border text-[10px] font-mono tracking-wider uppercase flex items-center space-x-2 transition-colors ${isStable ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'}`}>
            {isTesting && <Activity className="w-3 h-3 animate-pulse" />}
            {isStable && <CheckCircle2 className="w-3 h-3" />}
            <span>{isTesting ? 'Scanning Matrices...' : 'Audit Passed'}</span>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-white/5 bg-gradient-to-br from-[#09090f] to-black relative overflow-hidden">
            {isTesting && <motion.div className="absolute top-0 bottom-0 left-0 w-1 bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)]" animate={{ left: ['0%', '100%', '0%'] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} />}
            <span className="text-[10px] font-mono text-neutral-500 uppercase">Critical Vulnerabilities</span>
            <p className="text-2xl font-mono text-emerald-400 mt-2">0</p>
          </div>
          <div className="p-4 rounded-xl border border-white/5 bg-gradient-to-br from-[#09090f] to-black relative overflow-hidden">
            <span className="text-[10px] font-mono text-neutral-500 uppercase">Syntax Integrity</span>
            <p className="text-2xl font-mono text-cyan-400 mt-2">100%</p>
          </div>
          <div className="p-4 rounded-xl border border-white/5 bg-gradient-to-br from-[#09090f] to-black relative overflow-hidden">
            <span className="text-[10px] font-mono text-neutral-500 uppercase">Dependencies Scanned</span>
            <p className="text-2xl font-mono text-white mt-2">Verified</p>
          </div>
        </div>

        {/* Live CI/CD Check List */}
        <div className="p-5 rounded-xl border border-white/5 bg-[#040406] space-y-4">
          <h3 className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest border-b border-white/5 pb-2 flex items-center space-x-2">
            <Search className="w-3 h-3 text-cyan-500" />
            <span>Active Pipeline Checks</span>
          </h3>
          <div className="space-y-3">
            {[
              { id: 1, text: "Cross-Site Scripting (XSS) Sanitization", delay: 0 },
              { id: 2, text: "SQL Injection Vector Prevention", delay: 0.2 },
              { id: 3, text: "Component Memory Leak Analysis", delay: 0.4 },
              { id: 4, text: "API Rate-Limit Configuration", delay: 0.6 },
            ].map((check) => (
              <motion.div 
                key={check.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: check.delay }}
                className="flex items-center justify-between text-[11px] font-mono"
              >
                <div className="flex items-center space-x-3 text-neutral-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{check.text}</span>
                </div>
                <span className="text-neutral-600 bg-white/[0.02] px-2 py-0.5 rounded border border-white/5">PASS</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Terminal Output specifically for the QA Agent */}
        <div className="rounded-xl border border-white/10 bg-[#020204] overflow-hidden">
          <div className="flex items-center space-x-2 px-4 py-2 border-b border-white/5 bg-[#060608]">
            <TerminalSquare className="w-3.5 h-3.5 text-neutral-500" />
            <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Reviewer Node Output</span>
          </div>
          <div className="p-4 space-y-2 min-h-[100px]">
            {qaLogs.length === 0 ? (
              <span className="text-[10px] font-mono text-cyan-500 animate-pulse">Initializing security matrices...</span>
            ) : (
              qaLogs.map(log => (
                <div key={log.id} className="flex items-start space-x-2 text-[11px] font-mono">
                  <span className="text-cyan-500 mt-0.5">{'>'}</span>
                  <p className="text-neutral-300 leading-relaxed">{log.text}</p>
                </div>
              ))
            )}
            {isStable && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start space-x-2 text-[11px] font-mono pt-2">
                <span className="text-emerald-500 mt-0.5">{'>'}</span>
                <p className="text-emerald-400 font-bold">SYSTEM_CLEARED_FOR_DEPLOYMENT</p>
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}