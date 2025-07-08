import React, { useState, useCallback, useRef } from "react";
import { MessageType } from "@/types";

interface ToastOptions {
  message: string;
  type?: MessageType;
}

export default function useToast(): [
  (message: string, type?: MessageType) => void,
  React.ReactNode
] {
  const [toast, setToast] = useState<ToastOptions | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback(
    (message: string, type: MessageType = MessageType.ERROR) => {
      setToast({ message, type });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setToast(null), 4000);
    },
    []
  );

  const Toast = toast ? (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg text-white
      ${
        toast.type === MessageType.ERROR
          ? "bg-red-600"
          : toast.type === MessageType.SUCCESS
          ? "bg-green-600"
          : "bg-blue-600"
      }
    `}
    >
      {toast.message}
    </div>
  ) : null;

  return [showToast, Toast];
}
