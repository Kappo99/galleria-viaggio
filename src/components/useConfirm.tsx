import React, { useState, useCallback } from 'react';

interface ConfirmOptions {
  message: string;
  resolve: (value: boolean) => void;
}

export default function useConfirm(): [
  (message: string) => Promise<boolean>,
  React.ReactNode
] {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);

  const confirm = useCallback((message: string) => {
    return new Promise<boolean>((resolve) => {
      setOptions({ message, resolve });
    });
  }, []);

  const handleConfirm = () => {
    options?.resolve(true);
    setOptions(null);
  };
  const handleCancel = () => {
    options?.resolve(false);
    setOptions(null);
  };

  const ConfirmDialog = options ? (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative flex items-center justify-center min-h-screen z-50">
        <div className="bg-white text-dark p-6 rounded shadow-lg max-w-sm text-center mx-auto pointer-events-auto">
          <p className="mb-4">{options.message}</p>
          <div className="flex justify-center gap-4">
            <button onClick={handleConfirm} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded cursor-pointer">OK</button>
            <button onClick={handleCancel} className="bg-gray-300 hover:bg-gray-400 text-dark px-4 py-2 rounded cursor-pointer">Annulla</button>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return [confirm, ConfirmDialog];
} 