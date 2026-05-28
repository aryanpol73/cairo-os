"use client"

import React, { useEffect } from 'react'
import { useOrchestrationStore } from '../../store/useOrchestrationStore'
import { Archive, Database, ChevronRight, Clock } from 'lucide-react'

export function HistorySidebar() {
  const { history, fetchHistory, loadProject } = useOrchestrationStore()

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return (
    <div className="w-full h-full p-4 flex flex-col border-r border-white/5 bg-[#040406]">
      <div className="flex items-center justify-between mb-6 px-2">
        <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">Workspace Memory</span>
        <Database className="w-3.5 h-3.5 text-neutral-500" />
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
        {history.length === 0 ? (
          <div className="text-center mt-10 space-y-3">
            <Archive className="w-8 h-8 text-white/10 mx-auto" />
            <p className="text-[10px] font-mono text-neutral-500 uppercase">No projects saved yet</p>
          </div>
        ) : (
          history.map((project) => (
            <button
              key={project.id}
              onClick={() => loadProject(project.id)}
              className="w-full text-left p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-violet-500/30 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">
                    PRJ-{project.id}
                  </span>
                  <div className="flex items-center space-x-1 text-[9px] font-mono text-neutral-600">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-violet-400 transition-colors" />
              </div>
              <p className="text-xs text-neutral-300 font-sans leading-relaxed line-clamp-2">{project.prompt}</p>
            </button>
          ))
        )}
      </div>
    </div>
  )
}