import { create } from 'zustand'

interface StepState {
  currentStep: number
  setCurrentStep: (step: number) => void
  steps: string[]
  completedSteps: Set<number>
  markStepCompleted: (step: number) => void
  isStepCompleted: (step: number) => boolean
}

export const useStepStore = create<StepState>((set, get) => ({
  currentStep: 0,
  steps: ['Model','Voice','Knowledge', 'Review'],
  completedSteps: new Set(),
  setCurrentStep: (step) => set({ currentStep: step }),
  markStepCompleted: (step) => {
    const { completedSteps } = get()
    completedSteps.add(step)
    set({ completedSteps: new Set(completedSteps) })
  },
  isStepCompleted: (step) => get().completedSteps.has(step)
})) 