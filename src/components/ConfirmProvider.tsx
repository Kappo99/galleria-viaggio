'use client';
import React, { createContext, useContext, useRef } from 'react';
import useConfirm from './useConfirm';

// Il tipo della funzione confirm
export type ConfirmFn = (message: string) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn>(() => Promise.resolve(false));

export function useGlobalConfirm() {
  return useContext(ConfirmContext);
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [confirm, ConfirmDialog] = useConfirm();
  // Il ref serve per evitare warning su cambiamenti di funzione
  const confirmRef = useRef(confirm);
  confirmRef.current = confirm;

  return (
    <ConfirmContext.Provider value={confirmRef.current}>
      {children}
      {ConfirmDialog}
    </ConfirmContext.Provider>
  );
} 