'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, ArrowLeft, Check } from 'lucide-react'

interface AuthPanelProps {
  url: string
  onAnalyze: () => void
  onCancel: () => void
  loading: boolean
}

export default function AuthPanel({ url, onAnalyze, onCancel, loading }: AuthPanelProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-4">
        <div className="flex items-center gap-2 text-[hsl(50,6%,58%)] text-sm">
          <Shield className="w-4 h-4 text-[hsl(80,80%,50%)]" />
          <span>
            This page requires authentication. Log in below -- your credentials stay in the browser.
          </span>
        </div>

        <Card className="bg-[hsl(70,10%,16%)] border-[hsl(70,8%,22%)] rounded-none overflow-hidden">
          <CardContent className="p-0">
            <iframe
              src={url}
              title="Authentication"
              className="w-full border-0"
              style={{ height: '500px' }}
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            />
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onCancel}
            className="bg-transparent border-[hsl(70,8%,22%)] text-[hsl(50,6%,58%)] hover:bg-[hsl(70,10%,22%)] hover:text-[hsl(60,30%,96%)] rounded-none"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={onAnalyze}
            disabled={loading}
            className="bg-[hsl(80,80%,50%)] text-[hsl(70,10%,10%)] hover:bg-[hsl(80,80%,45%)] font-mono font-semibold rounded-none"
          >
            <Check className="w-4 h-4 mr-2" />
            {loading ? 'Analyzing...' : 'Page Ready -- Analyze'}
          </Button>
        </div>

        <p className="text-xs text-[hsl(50,6%,58%)] text-center">
          Your credentials are entered directly on the target site. This app never accesses or stores them.
        </p>
      </div>
    </div>
  )
}
