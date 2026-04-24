'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Search, AlertCircle, Zap } from 'lucide-react'

interface AnalysisInputProps {
  url: string
  setUrl: (url: string) => void
  needsAuth: boolean
  setNeedsAuth: (v: boolean) => void
  onAnalyze: () => void
  onShowAuth: () => void
  error: string
  loading: boolean
}

function isValidUrl(str: string): boolean {
  try {
    const u = new URL(str)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export default function AnalysisInput({
  url, setUrl, needsAuth, setNeedsAuth, onAnalyze, onShowAuth, error, loading
}: AnalysisInputProps) {
  const [touched, setTouched] = useState(false)
  const valid = isValidUrl(url)
  const showError = touched && url.length > 0 && !valid

  const handleSubmit = () => {
    setTouched(true)
    if (!valid) return
    if (needsAuth) {
      onShowAuth()
    } else {
      onAnalyze()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-[hsl(52,100%,62%)]" />
            <h1 className="text-2xl font-bold tracking-tight font-mono text-[hsl(60,30%,96%)]">
              Lyzr App Analyzer
            </h1>
          </div>
          <p className="text-sm text-[hsl(50,6%,58%)] max-w-md mx-auto">
            Analyze any Lyzr Architect application -- extract tech stack, agent configurations, data flows, and optimization insights.
          </p>
        </div>

        <Card className="bg-[hsl(70,10%,16%)] border-[hsl(70,8%,22%)] rounded-none">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-mono text-[hsl(50,6%,58%)] uppercase tracking-wider">
                Application URL
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(50,6%,58%)]" />
                  <Input
                    value={url}
                    onChange={(e) => { setUrl(e.target.value); setTouched(true) }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="https://app.lyzr.ai/your-app-url"
                    className="pl-10 bg-[hsl(70,8%,28%)] border-[hsl(70,8%,22%)] text-[hsl(60,30%,96%)] font-mono text-sm rounded-none placeholder:text-[hsl(50,6%,40%)] focus-visible:ring-[hsl(80,76%,53%)]"
                  />
                </div>
              </div>
              {showError && (
                <div className="flex items-center gap-1.5 text-[hsl(338,95%,55%)] text-xs">
                  <AlertCircle className="w-3 h-3" />
                  <span>Enter a valid URL (https://...)</span>
                </div>
              )}
              {error && (
                <div className="flex items-center gap-1.5 text-[hsl(338,95%,55%)] text-xs">
                  <AlertCircle className="w-3 h-3" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="needs-auth"
                checked={needsAuth}
                onCheckedChange={(v) => setNeedsAuth(v === true)}
                className="border-[hsl(70,8%,22%)] data-[state=checked]:bg-[hsl(52,100%,62%)] data-[state=checked]:text-[hsl(70,10%,10%)] rounded-none"
              />
              <Label htmlFor="needs-auth" className="text-xs text-[hsl(50,6%,58%)] cursor-pointer">
                Requires login to access
              </Label>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!valid || loading}
              className="w-full bg-[hsl(52,100%,62%)] text-[hsl(70,10%,10%)] hover:bg-[hsl(52,100%,55%)] font-mono font-semibold rounded-none disabled:opacity-40"
            >
              {loading ? 'Analyzing...' : needsAuth ? 'Continue to Login' : 'Analyze App'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
