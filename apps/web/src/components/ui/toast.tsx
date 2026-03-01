'use client';

import { useEffect, useState, createContext, useContext, useCallback } from 'react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastContextType {
  toast: (type: Toast['type'], message: string) => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[9998] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setShow(true));
  }, []);

  const colors: Record<string, string> = {
    success: 'border-[rgba(34,197,94,0.4)] bg-[rgba(34,197,94,0.08)]',
    error:   'border-[rgba(239,68,68,0.4)] bg-[rgba(239,68,68,0.08)]',
    info:    'border-[rgba(0,255,255,0.4)] bg-[rgba(0,255,255,0.08)]',
  };

  const icons: Record<string, string> = {
    success: 'fa-solid fa-check text-[#22c55e]',
    error:   'fa-solid fa-xmark text-[#ef4444]',
    info:    'fa-solid fa-info text-[#00ffff]',
  };

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 px-5 py-3 border rounded-[3px] backdrop-blur-xl min-w-[280px] transition-all duration-300 ${colors[toast.type]} ${show ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}
    >
      <i className={`${icons[toast.type]} text-sm`} />
      <span className="text-[11px] font-[family-name:var(--font-jetbrains)] text-[#f0f0f0] flex-1">{toast.message}</span>
      <button onClick={onDismiss} className="text-[rgba(240,240,240,0.3)] hover:text-[#f0f0f0] transition-colors text-xs bg-transparent border-none cursor-pointer">
        <i className="fa-solid fa-xmark" />
      </button>
    </div>
  );
}
