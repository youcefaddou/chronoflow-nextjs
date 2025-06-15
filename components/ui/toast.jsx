'use client'

import React, { forwardRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

const Toast = forwardRef(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: 'bg-white border border-gray-200 text-gray-900',
    destructive: 'bg-red-50 border border-red-200 text-red-900',
    success: 'bg-green-50 border border-green-200 text-green-900',
    warning: 'bg-yellow-50 border border-yellow-200 text-yellow-900',
  }

  return (
    <div
      ref={ref}
      className={cn(
        'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md p-4 pr-8 shadow-lg transition-all',
        variants[variant],
        className
      )}
      {...props}
    />
  )
})
Toast.displayName = 'Toast'

const ToastAction = forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-transparent px-3 text-sm font-medium ring-offset-white transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      className
    )}
    {...props}
  />
))
ToastAction.displayName = 'ToastAction'

const ToastClose = forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'absolute right-2 top-2 rounded-md p-1 text-gray-500 opacity-0 transition-opacity hover:text-gray-900 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100',
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </button>
))
ToastClose.displayName = 'ToastClose'

const ToastTitle = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm font-semibold', className)}
    {...props}
  />
))
ToastTitle.displayName = 'ToastTitle'

const ToastDescription = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm opacity-90', className)}
    {...props}
  />
))
ToastDescription.displayName = 'ToastDescription'

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastTitle,
  ToastDescription,
}