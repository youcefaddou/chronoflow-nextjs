'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function MobileMenuToggle({ isOpen, onToggle, className = '' }) {
  return (
    <button
      onClick={onToggle}
      className={`
        lg:hidden
        inline-flex items-center justify-center
        p-2 rounded-md
        text-gray-700 hover:text-gray-900
        hover:bg-gray-100
        transition-colors duration-200
        ${className}
      `}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
      aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
    >
      {isOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <Menu className="h-6 w-6" />
      )}
    </button>  );
}

export function ResponsiveContainer({ children, className = '' }) {
  return (
    <div className={`
      w-full
      max-w-full
      overflow-x-hidden
      ${className}
    `}>
      {children}
    </div>  );
}

export function MobileOptimizedButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button'
}) {
  const baseClasses = `
    inline-flex items-center justify-center
    font-medium rounded-md
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    touch-manipulation
  `;

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[2.5rem] sm:min-h-[2rem]',
    md: 'px-4 py-2 text-base min-h-[3rem] sm:min-h-[2.5rem]',
    lg: 'px-6 py-3 text-lg min-h-[3.5rem] sm:min-h-[3rem]'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </button>  );
}

export function ResponsiveGrid({
  children,
  columns = { default: 1, sm: 2, lg: 3 },
  gap = 4,
  className = ''
}) {
  const getGridClasses = () => {
    let classes = 'grid';
    
    if (columns.default) classes += ` grid-cols-${columns.default}`;
    if (columns.sm) classes += ` sm:grid-cols-${columns.sm}`;
    if (columns.md) classes += ` md:grid-cols-${columns.md}`;
    if (columns.lg) classes += ` lg:grid-cols-${columns.lg}`;
    if (columns.xl) classes += ` xl:grid-cols-${columns.xl}`;
    
    classes += ` gap-${gap}`;
    
    return classes;
  };

  return (
    <div className={`${getGridClasses()} ${className}`}>
      {children}
    </div>
  );
}
