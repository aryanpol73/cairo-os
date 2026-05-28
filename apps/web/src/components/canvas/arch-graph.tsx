"use client"

import React from 'react'
import { useOrchestrationStore } from '../../store/useOrchestrationStore'
import { Server, Database, Cpu, HardDrive, Share2 } from 'lucide-react'

export function ArchitectureGraph() {
  const { architecture } = useOrchestrationStore()
  const nodes = architecture?.nodes || []
  const edges = architecture?.edges || []

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'client': return <Cpu className="w-5 h-5 text-sky-400" />
      case 'server': return <Server className="w-5 h-5 text-indigo-400" />
      case 'database': return <Database className="w-5 h-5 text-emerald-400" />
      case 'cache': return <HardDrive className="w-5 h-5 text-amber-400" />
      default: return <Server className="w-5 h-5 text-neutral-400" />
    }
  }

  return (
    <div className="w-full h-full flex flex-col p-6 overflow-y-auto">
      <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6 shrink-0">
        <div className="flex items-center space-x-2 font-mono text-xs text-neutral-400 uppercase tracking-widest">
          <Share2 className="w-4 h-4 text-violet-400 animate-pulse" />
          <span>Dynamic Topology Blueprint</span>
        </div>
        <span className="text-[9px] font-mono bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded uppercase">
          {nodes.length > 0 ? `${nodes.length} Nodes Rendered` : 'Awaiting Pipeline'}
        </span>
      </div>

      {nodes.length === 0 ? (
        <div className="flex-1 w-full flex flex-col items-center justify-center border border-dashed border-white/5 rounded-2xl bg-white/[0.01] p-12 text-center min-h-[40vh]">
          <span className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-mono text-xs text-neutral-500">Gemini Core is constructing dynamic infrastructure layouts...</p>
        </div>
      ) : (
        <div className="flex-1 w-full flex flex-col justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto w-full">
            {nodes.map((node) => (
              <div 
                key={node.id} 
                className="relative p-5 rounded-2xl border border-white/5 bg-[#09090f]/60 backdrop-blur-md hover:border-violet-500/30 transition-all duration-300 flex flex-col items-center text-center space-y-4 group shadow-lg"
              >
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 group-hover:bg-violet-500/10 group-hover:border-violet-500/20 transition-all duration-300">
                  {getNodeIcon(node.type)}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-neutral-200 tracking-wide group-hover:text-white transition-colors">{node.label}</h4>
                  <p className="text-[10px] font-mono text-neutral-500 mt-1 uppercase tracking-wider">{node.type} node</p>
                </div>
                <div className="text-[9px] font-mono text-neutral-600 bg-black/40 px-2 py-0.5 rounded border border-white/5 uppercase">
                  ID: {node.id}
                </div>
              </div>
            ))}
          </div>

          {edges.length > 0 && (
            <div className="mt-8 max-w-xl mx-auto w-full p-4 border border-white/5 bg-black/20 rounded-xl font-mono text-[10px] text-neutral-500 space-y-1">
              <span className="text-neutral-400 block mb-1 uppercase tracking-wider font-bold">Network Edge Handshakes:</span>
              {edges.map((edge, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <span className="text-violet-400">{edge.source}</span>
                  <span>➔</span>
                  <span className="text-sky-400">{edge.target}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}