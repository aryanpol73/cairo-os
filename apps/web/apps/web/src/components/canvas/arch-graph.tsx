"use client"

import React, { useEffect, useMemo } from 'react'
import { 
  ReactFlow, 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState,
  type Node,
  type Edge
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useOrchestrationStore } from "../../store/useOrchestrationStore"

const nodeStyles = "px-4 py-3 rounded-xl border border-white/10 bg-[#09090f]/90 backdrop-blur-md text-xs font-mono text-neutral-200 shadow-xl min-w-[150px] text-center relative overflow-hidden"

export function ArchitectureGraph() {
  const { currentPhase } = useOrchestrationStore()
  
  // Explicit generic type definitions to eliminate the "never[]" issue
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  const initialNodes = useMemo<Node[]>(() => [
    {
      id: 'client',
      type: 'default',
      data: { label: '🌐 Next.js 15 Client (PWA)' },
      position: { x: 250, y: 0 },
      className: `${nodeStyles} border-amber-500/20 shadow-amber-500/5`
    },
    {
      id: 'gateway',
      type: 'default',
      data: { label: '🛡️ FastAPI Gateway / WS' },
      position: { x: 250, y: 100 },
      className: `${nodeStyles} border-violet-500/30 shadow-violet-500/5`
    },
    {
      id: 'langgraph',
      type: 'default',
      data: { label: '🧠 LangGraph Agent Engine' },
      position: { x: 100, y: 200 },
      className: `${nodeStyles} border-purple-500/20`
    },
    {
      id: 'redis',
      type: 'default',
      data: { label: '⚡ Redis Cache Layer' },
      position: { x: 400, y: 200 },
      className: `${nodeStyles} border-rose-500/20`
    },
    {
      id: 'database',
      type: 'default',
      data: { label: '🗄️ Supabase PostgreSQL DB' },
      position: { x: 250, y: 320 },
      className: `${nodeStyles} border-emerald-500/20 shadow-emerald-500/5`
    }
  ], [])

  const initialEdges = useMemo<Edge[]>(() => [
    { id: 'e1-2', source: 'client', target: 'gateway', animated: true, style: { stroke: '#a78bfa', strokeWidth: 1.5 } },
    { id: 'e2-3', source: 'gateway', target: 'langgraph', animated: false, style: { stroke: '#4b5563' } },
    { id: 'e2-4', source: 'gateway', target: 'redis', animated: false, style: { stroke: '#4b5563' } },
    { id: 'e3-5', source: 'langgraph', target: 'database', animated: false, style: { stroke: '#4b5563' } },
    { id: 'e4-5', source: 'redis', target: 'database', animated: false, style: { stroke: '#4b5563' } },
  ], [])

  useEffect(() => {
    if (currentPhase === 'idle' || currentPhase === 'discovery') {
      setNodes(initialNodes.slice(0, 1))
      setEdges([])
    } else if (currentPhase === 'architecting') {
      setNodes(initialNodes.slice(0, 4))
      setEdges(initialEdges.slice(0, 3))
    } else {
      setNodes(initialNodes)
      setEdges(initialEdges.map(edge => ({ ...edge, animated: true })))
    }
  }, [currentPhase, initialNodes, initialEdges, setNodes, setEdges])

  return (
    <div className="w-full h-full relative overflow-hidden rounded-2xl">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        colorMode="dark"
        proOptions={{ hideAttribution: true }}
      >
        {/* Style tag used to handle background opacity safely */}
        <Background color="#ffffff" gap={16} size={1} style={{ opacity: 0.015 }} />
        <Controls className="!bg-[#09090f] !border-white/10 !text-white opacity-40 hover:opacity-100 transition-opacity" />
      </ReactFlow>
      
      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/5 pointer-events-none z-10">
        <p className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase">
          Topology Status: <span className="text-violet-400 animate-pulse">{currentPhase === 'architecting' ? 'Compiling...' : 'Online'}</span>
        </p>
      </div>
    </div>
  )
}