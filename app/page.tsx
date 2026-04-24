'use client'

import React, { useState, useEffect } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Cpu } from 'lucide-react'

import AnalysisInput from './sections/AnalysisInput'
import AuthPanel from './sections/AuthPanel'
import AnalysisReport from './sections/AnalysisReport'

const AGENT_ID = '69ea26a3dcd146a72248ce95'

const THEME_VARS = {
  '--background': '70 10% 12%',
  '--foreground': '60 30% 96%',
  '--card': '70 10% 16%',
  '--card-foreground': '60 30% 96%',
  '--primary': '52 100% 62%',
  '--primary-foreground': '70 10% 10%',
  '--secondary': '70 10% 22%',
  '--secondary-foreground': '60 30% 96%',
  '--accent': '80 80% 50%',
  '--accent-foreground': '70 10% 10%',
  '--destructive': '338 95% 55%',
  '--muted': '70 10% 26%',
  '--muted-foreground': '50 6% 58%',
  '--border': '70 8% 22%',
  '--input': '70 8% 28%',
  '--ring': '80 76% 53%',
  '--radius': '0rem',
} as React.CSSProperties

const SAMPLE_REPORT = {
  executive_summary: {
    app_name: 'Smart Customer Support Hub',
    architecture_pattern: 'Manager-SubAgent',
    key_findings: [
      'Uses GPT-4o for complex reasoning tasks with appropriate temperature settings',
      'Knowledge base integration enables context-aware responses',
      'Multi-agent orchestration handles routing, analysis, and response generation',
      'Slack and email integrations enable multi-channel support',
    ],
    agent_count: '4',
    integration_count: '3',
    kb_count: '2',
    overall_assessment: 'Well-architected application with clear separation of concerns. The manager-subagent pattern effectively routes queries to specialized agents. Temperature settings are appropriate for each agent role.',
  },
  tech_stack: {
    frontend: [
      { name: 'Next.js 14', category: 'Framework', confidence: 'high' },
      { name: 'React 18', category: 'UI Library', confidence: 'high' },
      { name: 'Tailwind CSS', category: 'Styling', confidence: 'high' },
      { name: 'shadcn/ui', category: 'Component Library', confidence: 'medium' },
    ],
    backend: [
      { name: 'Node.js', category: 'Runtime', confidence: 'high' },
      { name: 'Lyzr Agent API', category: 'Agent Framework', confidence: 'high' },
    ],
    ai_ml: [
      { name: 'GPT-4o', category: 'LLM', confidence: 'high' },
      { name: 'GPT-4o-mini', category: 'LLM', confidence: 'high' },
      { name: 'text-embedding-3-small', category: 'Embedding', confidence: 'medium' },
    ],
    infrastructure: [
      { name: 'Vercel', category: 'Hosting', confidence: 'medium' },
      { name: 'MongoDB Atlas', category: 'Database', confidence: 'low' },
    ],
  },
  agent_architecture: {
    pattern: 'Manager-SubAgent',
    pattern_description: 'A central manager agent routes incoming queries to specialized sub-agents based on intent classification. Each sub-agent handles a specific domain.',
    agents: [
      { name: 'Query Router', type: 'manager', model: 'gpt-4o', temperature: '0.1', tools: ['intent_classifier'], knowledge_bases: [], description: 'Routes incoming customer queries to the appropriate specialist agent.' },
      { name: 'FAQ Agent', type: 'sub-agent', model: 'gpt-4o-mini', temperature: '0.3', tools: ['search'], knowledge_bases: ['product_docs', 'faq_database'], description: 'Handles common questions using the product knowledge base.' },
      { name: 'Technical Support Agent', type: 'sub-agent', model: 'gpt-4o', temperature: '0.2', tools: ['code_analyzer', 'log_parser'], knowledge_bases: ['technical_docs'], description: 'Provides technical troubleshooting assistance.' },
      { name: 'Escalation Agent', type: 'sub-agent', model: 'gpt-4o-mini', temperature: '0.5', tools: ['ticket_creator', 'slack_notify'], knowledge_bases: [], description: 'Creates support tickets and notifies the team.' },
    ],
    communication_flows: [
      { from: 'Query Router', to: 'FAQ Agent', description: 'Routes general product questions' },
      { from: 'Query Router', to: 'Technical Support Agent', description: 'Routes technical issues' },
      { from: 'Query Router', to: 'Escalation Agent', description: 'Routes complex issues needing human review' },
    ],
  },
  data_flow_integrations: {
    data_flows: [
      { name: 'Customer Query Ingestion', path: 'User Input -> Query Router -> Sub-Agent', description: 'Incoming queries are classified and routed.' },
      { name: 'Knowledge Retrieval', path: 'Sub-Agent -> RAG Pipeline -> KB', description: 'Agents retrieve context from documentation.' },
      { name: 'Escalation Pipeline', path: 'Escalation Agent -> Ticket System -> Slack', description: 'Unresolved issues create tickets and notify the team.' },
    ],
    integrations: [
      { name: 'Slack', type: 'Messaging', status: 'active' },
      { name: 'Zendesk', type: 'Ticketing', status: 'active' },
      { name: 'SendGrid', type: 'Email', status: 'connected' },
    ],
  },
  prompt_analysis: {
    overall_quality: 'Good - Well-structured prompts with clear role definitions',
    patterns: [
      { name: 'System Role Definition', quality: 'high', suggestion: 'Consider adding few-shot examples for edge cases.' },
      { name: 'Output Format Specification', quality: 'high', suggestion: 'JSON output schemas are well-defined.' },
      { name: 'Context Window Management', quality: 'medium', suggestion: 'Implement sliding window for long conversations.' },
      { name: 'Error Handling Instructions', quality: 'low', suggestion: 'Add explicit fallback instructions.' },
    ],
    strengths: [
      'Clear role separation between agents',
      'Consistent JSON output formatting',
      'Temperature values match agent responsibilities',
      'Knowledge base grounding reduces hallucination',
    ],
    weaknesses: [
      'No explicit error handling in prompts',
      'Missing conversation history summarization',
      'Escalation criteria could be more specific',
    ],
  },
  performance_optimization: {
    model_assessment: 'Good model selection. GPT-4o for complex reasoning, GPT-4o-mini for simpler tasks. Balances cost and capability effectively.',
    temperature_assessment: 'Appropriate settings: low (0.1-0.2) for classification, moderate (0.3-0.5) for conversational responses.',
    recommendations: [
      { area: 'Caching', recommendation: 'Implement response caching for FAQ queries to reduce API calls by ~40%.', impact: 'high', priority: 'high' },
      { area: 'Model Selection', recommendation: 'Consider GPT-4o-mini for Query Router since classification is simpler.', impact: 'medium', priority: 'medium' },
      { area: 'Prompt Optimization', recommendation: 'Add few-shot examples to FAQ agent for better accuracy.', impact: 'medium', priority: 'low' },
      { area: 'Monitoring', recommendation: 'Add latency tracking per agent to identify bottlenecks.', impact: 'high', priority: 'medium' },
    ],
  },
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: '' }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[hsl(70,10%,12%)] text-[hsl(60,30%,96%)]">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-xl font-semibold mb-2 font-mono">Something went wrong</h2>
            <p className="text-[hsl(50,6%,58%)] mb-4 text-sm font-mono">{this.state.error}</p>
            <button onClick={() => this.setState({ hasError: false, error: '' })} className="px-4 py-2 bg-[hsl(52,100%,62%)] text-[hsl(70,10%,10%)] font-mono text-sm">
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

type AppState = 'input' | 'auth' | 'analyzing' | 'report'

export default function Page() {
  const [appState, setAppState] = useState<AppState>('input')
  const [url, setUrl] = useState('')
  const [report, setReport] = useState<any>(null)
  const [error, setError] = useState('')
  const [needsAuth, setNeedsAuth] = useState(false)
  const [showSample, setShowSample] = useState(false)
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null)

  useEffect(() => {
    if (showSample) {
      setUrl('https://app.lyzr.ai/sample-support-hub')
      setReport(SAMPLE_REPORT)
      setAppState('report')
    } else {
      setUrl('')
      setReport(null)
      setAppState('input')
      setError('')
    }
  }, [showSample])

  const fetchPageContent = async (targetUrl: string): Promise<string> => {
    const res = await fetch('/api/fetch-page', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: targetUrl }),
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error)
    return data.content ?? ''
  }

  const analyzeApp = async () => {
    setAppState('analyzing')
    setError('')
    setActiveAgentId(AGENT_ID)
    try {
      const pageContent = await fetchPageContent(url)
      const result = await callAIAgent(
        `Analyze this Lyzr Architect application. Here is the page content from the URL ${url}:\n\n${pageContent}`,
        AGENT_ID
      )
      setActiveAgentId(null)
      const data = result?.response?.result
      if (data && typeof data === 'object') {
        setReport(data)
        setAppState('report')
      } else {
        setError('Failed to parse analysis results. The agent returned an unexpected format.')
        setAppState('input')
      }
    } catch (err: any) {
      setActiveAgentId(null)
      setError(err?.message ?? 'Analysis failed. Please try again.')
      setAppState('input')
    }
  }

  const handleReset = () => {
    setShowSample(false)
    setAppState('input')
    setUrl('')
    setReport(null)
    setError('')
  }

  return (
    <ErrorBoundary>
      <div style={THEME_VARS} className="min-h-screen bg-[hsl(70,10%,12%)] text-[hsl(60,30%,96%)]">
        {/* Sample Toggle */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-[hsl(70,10%,16%)] border border-[hsl(70,8%,22%)] px-3 py-2">
          <Label htmlFor="sample-toggle" className="text-xs font-mono text-[hsl(50,6%,58%)] cursor-pointer">
            Sample Data
          </Label>
          <Switch
            id="sample-toggle"
            checked={showSample}
            onCheckedChange={setShowSample}
            className="data-[state=checked]:bg-[hsl(52,100%,62%)]"
          />
        </div>

        {appState === 'input' && (
          <AnalysisInput
            url={url}
            setUrl={setUrl}
            needsAuth={needsAuth}
            setNeedsAuth={setNeedsAuth}
            onAnalyze={analyzeApp}
            onShowAuth={() => setAppState('auth')}
            error={error}
            loading={false}
          />
        )}

        {appState === 'auth' && (
          <AuthPanel
            url={url}
            onAnalyze={analyzeApp}
            onCancel={() => setAppState('input')}
            loading={false}
          />
        )}

        {(appState === 'analyzing' || appState === 'report') && (
          <AnalysisReport
            report={report}
            url={url}
            analyzing={appState === 'analyzing'}
            onReset={handleReset}
          />
        )}

        {/* Agent Status */}
        <div className="fixed bottom-4 left-4 z-50">
          <Card className="bg-[hsl(70,10%,16%)] border-[hsl(70,8%,22%)] rounded-none">
            <CardContent className="p-3 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-[hsl(50,6%,58%)]" />
              <span className="text-[10px] font-mono text-[hsl(50,6%,58%)]">App Analysis Coordinator</span>
              {activeAgentId ? (
                <Badge className="bg-[hsl(80,80%,50%)] text-[hsl(70,10%,10%)] rounded-none text-[9px] font-mono animate-pulse">ACTIVE</Badge>
              ) : (
                <Badge className="bg-[hsl(70,10%,26%)] text-[hsl(50,6%,58%)] rounded-none text-[9px] font-mono">IDLE</Badge>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ErrorBoundary>
  )
}
