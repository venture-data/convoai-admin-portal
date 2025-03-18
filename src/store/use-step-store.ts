import { create } from 'zustand'

interface StepState {
  currentStep: number
  steps: string[]
  completedSteps: number[]
  setCurrentStep: (step: number) => void
  markStepCompleted: (step: number) => void
  reset: () => void
}

export const useStepStore = create<StepState>((set) => ({
  currentStep: 0,
  steps: ['Basic Info', 'Model Settings', 'Interaction Settings', 'Voice', 'Knowledge', 'Review'],
  completedSteps: [],
  setCurrentStep: (step) => set({ currentStep: step }),
  markStepCompleted: (step) =>
    set((state) => ({
      completedSteps: [...new Set([...state.completedSteps, step])],
    })),
  reset: () => set({ currentStep: 0, completedSteps: [] }),
})) 