"use client"

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useOrchestrationStore } from "../../store/useOrchestrationStore"
import { CheckCircle2, Circle, Clock, Flame } from 'lucide-react'

type Task = {
  id: string
  title: string
  priority: 'low' | 'medium' | 'high'
  estimate: string
  status: 'backlog' | 'todo' | 'progress' | 'done'
}

export function SprintBoard() {
  const { currentPhase } = useOrchestrationStore()

  // Dynamic seed data mimicking real-time PM agent generation
  const tasks = useMemo<Task[]>(() => [
    { id: 'TSK-01', title: 'Configure WebSocket connection handshake protocols', priority: 'high', estimate: '3h', status: 'done' },
    { id: 'TSK-02', title: 'Establish global state slices via Zustand storage core', priority: 'high', estimate: '2h', status: 'done' },
    { id: 'TSK-03', title: 'Construct interactive node layout canvas topology pipeline', priority: 'medium', estimate: '5h', status: 'progress' },
    { id: 'TSK-04', title: 'Integrate multi-agent log streams into live chat feed component', priority: 'high', estimate: '4h', status: 'todo' },
    { id: 'TSK-05', title: 'Optimize PWA assets manifest configurations caching models', priority: 'low', estimate: '2h', status: 'backlog' },
  ], [])

  const columns = [
    { id: 'backlog', title: 'Backlog', icon: Circle, color: 'text-neutral-500' },
    { id: 'todo', title: 'To Do', icon: Clock, color: 'text-sky-400' },
    { id: 'progress', title: 'In Progress', icon: Flame, color: 'text-violet-400 animate-pulse' },
    { id: 'done', title: 'Completed', icon: CheckCircle2, color: 'text-emerald-400' },
  ]

  return (
    <div className="w-full h-full border border-white/5 bg-black/40 rounded-2xl p-6 backdrop-blur-sm overflow-y-auto flex flex-col space-y-4">
      
      {/* Kanban Local Control Stats Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono text-neutral-400">Sprint Backlog v1.0</span>
          <span className="h-1 w-1 rounded-full bg-neutral-700" />
          <span className="text-[11px] font-mono text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded">
            Auto-Scoping Enabled
          </span>
        </div>
      </div>

      {/* Columns Grid Panel Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
        {columns.map((col) => {
          const colTasks = tasks.filter(t => t.status === col.id)
          const ColIcon = col.icon

          return (
            <div key={col.id} className="flex flex-col space-y-3 bg-white/[0.01] border border-white/[0.02] p-3 rounded-xl min-h-[300px]">
              
              {/* Column Meta Title */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-2">
                  <ColIcon className={`w-3.5 h-3.5 ${col.color}`} />
                  <span className="text-xs font-semibold tracking-wide text-neutral-300 font-sans">{col.title}</span>
                </div>
                <span className="text-[10px] font-mono bg-white/5 border border-white/5 text-neutral-400 px-1.5 py-0.5 rounded">
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks List Drop Area */}
              <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
                {colTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative group/card p-3.5 rounded-xl border border-white/10 bg-[#09090f]/80 backdrop-blur-md shadow-lg space-y-3 overflow-hidden"
                  >
                    {/* Top Top Edge Reflection Catch */}
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent transition-opacity group-hover/card:via-white/15" />

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-neutral-500 font-medium">{task.id}</span>
                        <span className={`uppercase font-bold tracking-wider ${
                          task.priority === 'high' ? 'text-rose-400/80' : task.priority === 'medium' ? 'text-amber-400/80' : 'text-neutral-400/80'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-200 font-sans leading-relaxed tracking-wide font-medium">
                        {task.title}
                      </p>
                    </div>

                    {/* Meta Task Strip Row */}
                    <div className="flex items-center justify-between pt-1 border-t border-white/[0.03]">
                      <div className="flex items-center space-x-1.5 text-[10px] text-neutral-500 font-mono">
                        <Clock className="w-3 h-3" />
                        <span>Est: {task.estimate}</span>
                      </div>
                      <div className="h-4 w-4 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center text-[8px] font-mono text-neutral-400">
                        PM
                      </div>
                    </div>
                  </motion.div>
                ))}

                {colTasks.length === 0 && (
                  <div className="h-24 border border-dashed border-white/5 rounded-xl flex items-center justify-center text-[10px] font-mono text-neutral-600">
                    Queue Empty
                  </div>
                )}
              </div>

            </div>
          )
        })}
      </div>

    </div>
  )
}