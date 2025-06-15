'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Toast, ToastClose, ToastTitle, ToastDescription } from './toast'
import { CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'

const ToastContext = createContext()

let toastId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((toast) => {
    const id = `toast-${++toastId}`
    const newToast = {
      id,
      ...toast,
      duration: toast.duration ?? 5000,
    }

    setToasts(prevToasts => [...prevToasts, newToast])

    // Auto remove toast after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }

    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id))
  }, [])

  const toast = useCallback((props) => {
    return addToast(props)
  }, [addToast])

  // Convenience methods
  const success = useCallback((message, options = {}) => {
    return addToast({
      variant: 'success',
      title: options.title || 'Success',
      description: message,
      ...options,
    })
  }, [addToast])

  const error = useCallback((message, options = {}) => {
    return addToast({
      variant: 'destructive',
      title: options.title || 'Error',
      description: message,
      ...options,
    })
  }, [addToast])

  const warning = useCallback((message, options = {}) => {
    return addToast({
      variant: 'warning',
      title: options.title || 'Warning',
      description: message,
      ...options,
    })
  }, [addToast])
  const info = useCallback((message, options = {}) => {
    return addToast({
      variant: 'default',
      title: options.title || 'Info',
      description: message,
      ...options,
    })
  }, [addToast])

  // Backward compatibility method
  const showToast = useCallback((message, type = 'default', options = {}) => {
    const variantMap = {
      'success': 'success',
      'error': 'destructive',
      'warning': 'warning',
      'info': 'default',
      'default': 'default'
    }
    
    return addToast({
      variant: variantMap[type] || 'default',
      title: options.title,
      description: message,
      ...options,
    })
  }, [addToast])

  const value = {
    toast,
    success,
    error,
    warning,
    info,
    showToast,
    removeToast,
  }

  const getIcon = (variant) => {
    switch (variant) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />
      case 'destructive':
        return <AlertCircle className="h-5 w-5" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof window !== 'undefined' && createPortal(
        <div className="fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:top-auto sm:bottom-0 sm:right-0 sm:flex-col md:max-w-[420px]">
          {toasts.map((toastData) => (
            <Toast
              key={toastData.id}
              variant={toastData.variant}
              className="group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full mt-4 first:mt-0 sm:mt-0 sm:mb-4 sm:first:mb-0"
            >
              <div className="flex items-start space-x-2">
                {getIcon(toastData.variant)}
                <div className="grid gap-1">
                  {toastData.title && (
                    <ToastTitle className="text-sm font-semibold [&+div]:text-xs">
                      {toastData.title}
                    </ToastTitle>
                  )}
                  {toastData.description && (
                    <ToastDescription className="text-sm opacity-90">
                      {toastData.description}
                    </ToastDescription>
                  )}
                </div>
              </div>
              <ToastClose onClick={() => removeToast(toastData.id)} />
            </Toast>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}