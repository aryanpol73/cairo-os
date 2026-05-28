"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Play, CheckCircle2, Activity, Gauge } from 'lucide-react'

type TestSuite = {
  id: string
  name: string
  status: 'passed' | 'failed' | 'running' | 'queued'
  coverage: number
}

export function QARunner() {
  const [progress, setProgress] = useState(0)
  const [suites, setSuites] = useState<TestSuite[]>([
    { id: 'SUITE-01', name: 'Authentication Handshake & Token Validation', status: 'passed', coverage: 100 },
    { id: 'SUITE-02', name: 'Real-time WebSocket State Broadcast Matrix', status: 'passed', coverage: 98 },
    { id: 'SUITE-03', name: 'Isomorphic API Endpoint Boundary Integrity', status: 'running', coverage: 45 },
    { id: 'SUITE-04', name: 'Static Dependency Security Vulnerability Scan (SAST)', status: 'queued', coverage: 0 },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setSuites(s => s.map(suite => ({ ...suite, status: 'passed', coverage: suite.id === 'SUITE-04' ? 100 : suite.coverage })))
          return 100
        }
        
        if (prev === 40) {
          setSuites(s => s.map(suite => suite.id === 'SUITE-03' ? { ...suite, status: 'passed', coverage: 94 } : suite.id === 'SUITE-04' ? { ...suite, status: 'running', coverage: 12 } : suite))
        }
        return prev + 2
      })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full h-full flex flex-col bg-[#030305]/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/5 shadow-2xl p-6 space-y-6">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
        <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-neutral-500 uppercase">Overall Readiness</span>
            <h4 className="text-xl font-light font-mono text-violet-400">{progress}%</h4>
          </div>
          <Gauge className="w-5 h-5 text-violet-500/40" />
        </div>
        <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-neutral-500 uppercase">Security Standing</span>
            <h4 className="text-xl font-light font-mono text-emerald-400">Sec_Level A+</h4>
          </div>
          <ShieldCheck className="w-5 h-5 text-emerald-500/40" />
        </div>
        <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-neutral-500 uppercase">Coverage Avg</span>
            <h4 className="text-xl font-light font-mono text-sky-400">97.3%</h4>
          </div>
          <Activity className="w-5 h-5 text-sky-500/40" />
        </div>
      </div>

      {/* Main Runner Area */}
      <div className="flex-1 border border-white/5 bg-black/40 rounded-xl p-4 flex flex-col space-y-4 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center space-x-2">
            <Play className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
            <span className="text-xs font-mono text-neutral-300">Automated Swarm Suite Logs</span>
          </div>
          <span className="text-[10px] font-mono text-neutral-500">Threads: 8 Isolation Sandboxes</span>
        </div>

        <div className="flex-1 space-y-3">
          {suites.map((suite) => (
            <div key={suite.id} className="p-3.5 rounded-xl border border-white/[0.02] bg-[#06060a]/90 flex items-center justify-between">
              <div className="flex items-center space-x-4 min-w-0">
                <div className="shrink-0">
                  {suite.status === 'passed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : suite.status === 'running' ? (
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500" />
                    </span>
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-neutral-700" />
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-medium text-neutral-200 truncate">{suite.name}</span>
                  <span className="text-[9px] font-mono text-neutral-500">{suite.id} • Coverage: {suite.coverage}%</span>
                </div>
              </div>

              <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${
                suite.status === 'passed' 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : suite.status === 'running'
                  ? 'bg-violet-500/10 border-violet-500/20 text-violet-400 animate-pulse'
                  : 'bg-neutral-500/5 border-white/5 text-neutral-500'
              }`}>
                {suite.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}