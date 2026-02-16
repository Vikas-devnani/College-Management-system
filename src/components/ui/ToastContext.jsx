import React, { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext()

export function ToastProvider({ children }){
  const [toasts, setToasts] = useState([])
  const push = useCallback((msg, type='info')=>{
    const id = Date.now()
    setToasts(t=>[...t,{ id, msg, type }])
    setTimeout(()=> setToasts(t=> t.filter(x=>x.id!==id)), 4000)
  },[])
  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed right-4 top-4 flex flex-col gap-2 z-50">
        {toasts.map(t=> (
          <div key={t.id} className={`px-3 py-2 rounded shadow ${t.type==='error'? 'bg-red-500 text-white' : 'bg-slate-800 text-white'}`}>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(){ return useContext(ToastContext) }
