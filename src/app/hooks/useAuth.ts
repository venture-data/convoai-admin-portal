import { create } from 'zustand';

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

export const useAuthStore = create<States & Actions>((set, get) => ({
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
}));
