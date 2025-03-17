import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface States {
  name: string;
  email: string;
  password: string;
  token: string;
  isAuth: boolean;
  subscription: {
    planName: string;
    status: 'active' | 'inactive' | 'loading';
    subscriptionId?: string;
    customerId?: string;
    nextBilling?: string;
    price?: string;
  };
}

interface Actions {
  setCreds: (creds: Partial<States>) => void;
  getCreds: () => States;
  setSubscription: (subscription: Partial<States['subscription']>) => void;
}

export const useAuthStore = create<States & Actions>()(
  persist(
    (set, get) => ({
      name: '',
      email: '',
      password: '',
      isAuth: false,
      token: '',
      subscription: {
        planName: '',
        status: 'loading',
        subscriptionId: '',
        customerId: '',
        nextBilling: '',
        price: '',
        newPlanStarts:''
      },
      setCreds: (creds) => {
        set((state) => ({
          ...state,
          ...creds,
          subscription: {
            ...state.subscription,
            ...creds.subscription
          }
        }));
      },
      setSubscription: (subscription) => {
        set((state) => ({
          ...state,
          subscription: {
            ...state.subscription,
            ...subscription
          }
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
        subscription: state.subscription
      }),
    }
  )
);
