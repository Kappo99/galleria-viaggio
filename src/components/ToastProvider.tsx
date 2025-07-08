'use client';
import React, { createContext, useContext } from "react";
import useToast from "./useToast";
import type { MessageType } from "@/types";

type ToastContextType = (message: string, type?: MessageType) => void;

const ToastContext = createContext<ToastContextType>(() => {});

export function useGlobalToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [showToast, Toast] = useToast();

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {Toast}
    </ToastContext.Provider>
  );
}