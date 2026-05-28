"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Server, Activity, Disc, Globe } from 'lucide-react'

export function SystemStatus() {
  const [latency, setLatency] = useState(14)

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 6) + 12) // Shuffles latency between 12ms-18ms
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mt-12 px-4"
    >
      {/* Metric 1: Global Edge Cluster */}
      <div className="bg-[#09090f]/40 backdrop-blur-md border border-white/[0.03] p-4 rounded-2xl flex flex-col space-y-2 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">Edge Gate</span>
          <Globe className="w-3.5 h-3.5 text-neutral-600 group-hover:text-violet-400 transition-colors" />
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-lg font-mono font-light text-neutral-200">bom-01</span>
          <span className="text-[10px] font-mono text-emerald-400">Active</span>
        </div>
      </div>

      {/* Metric 2: LLM Token Latency */}
      <div className="bg-[#09090f]/40 backdrop-blur-md border border-white/[0.03] p-4 rounded-2xl flex flex-col space-y-2 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">API Latency</span>
          <Activity className="w-3.5 h-3.5 text-neutral-600 group-hover:text-violet-400 transition-colors" />
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-lg font-mono font-light text-neutral-200">{latency}ms</span>
          <span className="text-[9px] font-mono text-neutral-500">Stable</span>
        </div>
      </div>

      {/* Metric 3: Memory Safe Buffer */}
      <div className="bg-[#09090f]/40 backdrop-blur-md border border-white/[0.03] p-4 rounded-2xl flex flex-col space-y-2 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">Context Cache</span>
          <Disc className="w-3.5 h-3.5 text-neutral-600 group-hover:text-violet-400 transition-colors animate-spin-slow" />
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-lg font-mono font-light text-neutral-200">Redis-V</span>
          <span className="text-[10px] font-mono text-violet-400">99.8%</span>
        </div>
      </div>

      {/* Metric 4: Swarm State Synced */}
      <div className="bg-[#09090f]/40 backdrop-blur-md border border-white/[0.03] p-4 rounded-2xl flex flex-col space-y-2 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">Swarm Sync</span>
          <Server className="w-3.5 h-3.5 text-neutral-600 group-hover:text-violet-400 transition-colors" />
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-lg font-mono font-light text-neutral-200">Isomorphic</span>
          <span className="text-[10px] font-mono text-emerald-400">Ready</span>
        </div>
      </div>
    </motion.div>
  )
}