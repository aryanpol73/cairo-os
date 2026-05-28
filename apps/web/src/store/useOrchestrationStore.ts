import { create } from 'zustand'

export type PhaseType = 'idle' | 'discovery' | 'architecting' | 'planning' | 'implementing' | 'testing' | 'stable' | 'error'

interface ProjectHistory { id: number; prompt: string; created_at: string; }
interface LogItem { id: string; agent: string; text: string; color: string; }
interface SystemArchitecture { nodes: any[]; edges: any[]; }
interface SprintBacklog { tasks: any[]; }

interface OrchestrationState {
  currentPhase: PhaseType
  prompt: string
  logs: LogItem[]
  architecture: SystemArchitecture
  backlog: SprintBacklog
  generatedCode: string
  history: ProjectHistory[]
  ws: WebSocket | null
  // Added for workspace sync:
  updateFromBackend: (data: any) => void
  initializeEngine: (prompt: string) => void
  submitFeedback: (feedback: string) => void
  resetEngine: () => void
  addLog: (agent: string, text: string) => void
  fetchHistory: () => Promise<void>
  loadProject: (id: number) => Promise<void>
}

const getAgentColor = (agent: string | undefined) => {
  if (!agent) return 'text-neutral-500'
  const norm = agent.toLowerCase()
  if (norm.includes('architect')) return 'text-purple-400'
  if (norm.includes('product') || norm.includes('pm')) return 'text-emerald-400'
  if (norm.includes('developer') || norm.includes('engineer')) return 'text-violet-400'
  if (norm.includes('qa') || norm.includes('tester')) return 'text-cyan-400'
  if (norm.includes('system')) return 'text-neutral-500'
  return 'text-neutral-400'
}

// Get the base API URL from environment variables
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const WS_BASE = API_BASE.replace('http', 'ws');

export const useOrchestrationStore = create<OrchestrationState>((set, get) => ({
  currentPhase: 'idle',
  prompt: '',
  logs: [],
  architecture: { nodes: [], edges: [] },
  backlog: { tasks: [] },
  generatedCode: '',
  history: [],
  ws: null,

  updateFromBackend: (data: any) => {
    set((state) => {
      const newState = { ...state, ...data };
      if (data.currentPhase) newState.currentPhase = data.currentPhase;
      if (data.architecture) newState.architecture = data.architecture;
      if (data.backlog) newState.backlog = data.backlog;
      if (data.generatedCode) newState.generatedCode = data.generatedCode;
      if (data.agent && data.log) get().addLog(data.agent, data.log);
      return newState;
    });
  },

  addLog: (agent, text) => {
    set((state) => ({ logs: [...state.logs, { id: Math.random().toString(36).substring(7), agent: agent || 'SYSTEM', text: text || '', color: getAgentColor(agent) }] }))
  },

  initializeEngine: (userPrompt) => {
    const existingWs = get().ws; if (existingWs) existingWs.close()
    set({ prompt: userPrompt, currentPhase: 'discovery', logs: [], architecture: { nodes: [], edges: [] }, backlog: { tasks: [] }, generatedCode: '' })
    
    const socket = new WebSocket(`${WS_BASE}/ws/orchestrate`)
    socket.onopen = () => socket.send(JSON.stringify({ prompt: userPrompt }))
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        get().updateFromBackend(data)
        if (data.currentPhase === 'stable') get().fetchHistory()
      } catch (err) { console.error(err) }
    }
    socket.onclose = () => {}; socket.onerror = () => set({ currentPhase: 'error' })
    set({ ws: socket })
  },

  submitFeedback: (feedback) => {
    const existingWs = get().ws
    if (existingWs && existingWs.readyState === WebSocket.OPEN) {
      set({ currentPhase: 'architecting', logs: [] })
      get().addLog('SYSTEM', 'Transmitting refactor instructions...')
      existingWs.send(JSON.stringify({ type: 'feedback', prompt: feedback }))
    }
  },

  resetEngine: () => {
    const activeWs = get().ws; if (activeWs) activeWs.close()
    set({ currentPhase: 'idle', prompt: '', logs: [], ws: null, architecture: { nodes: [], edges: [] }, backlog: { tasks: [] }, generatedCode: '' })
  },

  fetchHistory: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/projects`)
      const data = await res.json()
      set({ history: data.projects || [] })
    } catch (e) { console.error("Failed to fetch history", e) }
  },

  loadProject: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/projects/${id}`)
      const data = await res.json()
      if (!data.error) {
        set({
          prompt: data.prompt, architecture: data.architecture, backlog: data.backlog, generatedCode: data.codebase,
          currentPhase: 'stable', logs: [{ id: 'loaded', agent: 'SYSTEM', text: `Loaded Project #${id} from memory.`, color: 'text-emerald-400' }]
        })
      }
    } catch (e) { console.error("Failed to load project", e) }
  }
}))