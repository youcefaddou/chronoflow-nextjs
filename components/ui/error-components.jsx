'use client';

import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { MobileOptimizedButton } from './responsive-components';

export function ErrorMessage({ 
  title = 'Something went wrong', 
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  onGoHome,
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-6 text-center ${className}`}>
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        {onRetry && (
          <MobileOptimizedButton
            onClick={onRetry}
            variant="primary"
            className="flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </MobileOptimizedButton>
        )}
        
        {onGoHome && (
          <MobileOptimizedButton
            onClick={onGoHome}
            variant="outline"
            className="flex items-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </MobileOptimizedButton>
        )}
      </div>
    </div>
  );
}

export function ErrorBoundaryFallback({ error, resetError }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <ErrorMessage
          title="Application Error"
          message="Something went wrong with the application. Our team has been notified."
          onRetry={resetError}
          onGoHome={() => window.location.href = '/'}
        />
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 p-4 bg-gray-100 rounded-lg">
            <summary className="cursor-pointer text-sm font-medium text-gray-700">
              Error Details (Development)
            </summary>
            <pre className="mt-2 text-xs text-gray-600 overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

export function NotFoundError({ 
  title = 'Page Not Found',
  message = 'The page you are looking for does not exist.',
  onGoHome
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center">
          <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
          <ErrorMessage
            title={title}
            message={message}
            onGoHome={onGoHome || (() => window.location.href = '/')}
          />
        </div>
      </div>
    </div>
  );
}
