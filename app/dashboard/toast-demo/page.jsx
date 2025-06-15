'use client'

import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { useToast } from '../../../components/ui/toast-provider'

export default function ToastDemoPage() {
  const { success, error, warning, info, showToast } = useToast()

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Toast Notification Demo</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Modern Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Modern Toast Methods</CardTitle>
              <CardDescription>
                Using the modern toast API with convenience methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => success('Operation completed successfully!')}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Success Toast
              </Button>
              
              <Button 
                onClick={() => error('Something went wrong. Please try again.')}
                variant="destructive"
                className="w-full"
              >
                Error Toast
              </Button>
              
              <Button 
                onClick={() => warning('Please check your input before proceeding.')}
                className="w-full bg-yellow-600 hover:bg-yellow-700"
              >
                Warning Toast
              </Button>
              
              <Button 
                onClick={() => info('Here is some helpful information.')}
                variant="outline"
                className="w-full"
              >
                Info Toast
              </Button>
            </CardContent>
          </Card>

          {/* Legacy Method */}
          <Card>
            <CardHeader>
              <CardTitle>Legacy showToast Method</CardTitle>
              <CardDescription>
                Using the backward-compatible showToast method
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => showToast('Connection successful!', 'success')}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                showToast Success
              </Button>
              
              <Button 
                onClick={() => showToast('Connection failed!', 'error')}
                variant="destructive"
                className="w-full"
              >
                showToast Error
              </Button>
              
              <Button 
                onClick={() => showToast('Please be careful!', 'warning')}
                className="w-full bg-yellow-600 hover:bg-yellow-700"
              >
                showToast Warning
              </Button>
              
              <Button 
                onClick={() => showToast('Just so you know...', 'info')}
                variant="outline"
                className="w-full"
              >
                showToast Info
              </Button>
            </CardContent>
          </Card>

          {/* Custom Options */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Advanced Toast Options</CardTitle>
              <CardDescription>
                Toasts with custom titles, durations, and no auto-dismiss
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Button 
                  onClick={() => success('Settings saved successfully!', { 
                    title: 'Settings Updated',
                    duration: 3000 
                  })}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Custom Title & Duration
                </Button>
                
                <Button 
                  onClick={() => error('Failed to save changes.', { 
                    title: 'Save Error',
                    duration: 0 // No auto-dismiss
                  })}
                  variant="destructive"
                >
                  Persistent Error
                </Button>
                
                <Button 
                  onClick={() => info('This toast will disappear in 10 seconds.', { 
                    duration: 10000 
                  })}
                  variant="outline"
                >
                  Long Duration
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Usage Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold">Modern API:</h4>
                <code className="block bg-gray-100 p-2 rounded mt-1">
                  {`const { success, error, warning, info } = useToast()
success('Operation completed!')
error('Something went wrong!')
warning('Please check your input')
info('Here is some information')`}
                </code>
              </div>
              
              <div>
                <h4 className="font-semibold">Legacy API:</h4>
                <code className="block bg-gray-100 p-2 rounded mt-1">
                  {`const { showToast } = useToast()
showToast('Message', 'success')
showToast('Message', 'error')
showToast('Message', 'warning')
showToast('Message', 'info')`}
                </code>
              </div>
              
              <div>
                <h4 className="font-semibold">With Options:</h4>
                <code className="block bg-gray-100 p-2 rounded mt-1">
                  {`success('Message', { 
  title: 'Custom Title',
  duration: 5000 // milliseconds (0 = no auto-dismiss)
})`}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
