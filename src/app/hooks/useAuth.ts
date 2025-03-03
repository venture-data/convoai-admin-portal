import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface States {
  name: string;
  email: string;
  password: string;
  token: string;
  isAuth: boolean;
}

interface Actions {
  setCreds: (creds: Partial<States>) => void;
  getCreds: () => States;
}

export const useAuthStore = create<States & Actions>()(
  persist(
    (set, get) => ({
      name: '',
      email: '',
      password: '',
      isAuth: false,
      token: '',
      setCreds: (creds) => {
        set((state) => ({
          ...state,
          ...creds, 
        }));
      },
      getCreds: () => {
        return get(); 
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        name: state.name,
        email: state.email,
        token: state.token,
        isAuth: state.isAuth,
      }),
    }
  )
);
