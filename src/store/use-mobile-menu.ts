import { create } from 'zustand'

interface MobileMenuState {
  isOpen: boolean
  toggle: () => void
  setIsOpen: (isOpen: boolean) => void
}

export const useMobileMenu = create<MobileMenuState>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setIsOpen: (isOpen) => set({ isOpen }),
})) 