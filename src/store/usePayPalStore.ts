import { create } from 'zustand';

interface PayPalState {
  isProcessing: boolean;
  setProcessing: (val: boolean) => void;
}

export const usePayPalStore = create<PayPalState>((set) => ({
  isProcessing: false,
  setProcessing: (val) => set({ isProcessing: val }),
}));
