import { create } from 'zustand'

type Phase = 'idle' | 'discovery' | 'architecting' | 'planning' | 'implementing'

interface OrchestrationState {
  currentPhase: Phase
  prompt: string
  isEngineActive: boolean
  setPrompt: (prompt: string) => void
  startEngine: () => void
  resetEngine: () => void
}

export const useOrchestrationStore = create<OrchestrationState>((set, get) => ({
  currentPhase: 'idle',
  prompt: '',
  isEngineActive: false,
  
  setPrompt: (prompt) => set({ prompt }),
  
  startEngine: () => {
    if (get().isEngineActive) return
    
    // 1. Lock the engine and start Discovery phase
    set({ isEngineActive: true, currentPhase: 'discovery' })

    // 2. Shift to Architecture graph after 3 seconds
    setTimeout(() => {
      set({ currentPhase: 'architecting' })
    }, 3000)

    // 3. Shift to Sprint Planner phase after 8 seconds
    setTimeout(() => {
      set({ currentPhase: 'planning' })
    }, 8000)

    // 4. Shift to Code Implementation phase after 12 seconds
    setTimeout(() => {
      set({ currentPhase: 'implementing' })
    }, 12000)
  },

  resetEngine: () => set({ 
    currentPhase: 'idle', 
    prompt: '', 
    isEngineActive: false 
  })
}))